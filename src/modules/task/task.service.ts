import { TaskStatus } from '@prisma/client';
import { CustomError } from '@libs/error';
import { BASE_URL } from '@libs/constants';
import { toRelativeUploadPath } from '@libs/uploadPath';
import { TaskRepo } from '@modules/task/task.repo';
import { GoogleCalendar } from '@modules/task/google/googleCalendar';
import { getGoogleAccessTokenFromRefresh } from '@modules/task/google/token';

type updateTaskBody = {
  title: string;
  description: string | null;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId: number;
  tags: string[];
  attachments: string[];
};

type UpdateTaskResult = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  assignee: { id: number; name: string; email: string; profileImage: string | null } | null;
  tags: { id: number; name: string }[];
  attachments: string[];
  subTasks: string[];
  createdAt: Date;
  updatedAt: Date;
};

export class TaskService {
  constructor(private repo: TaskRepo) {}

  // 태그 리팩토링 작업
  normalizeTags(tagNames: string[]) {
    return [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
  }

  // 최종 전달 response 맵핑 작업
  mapResponse = (task: any): UpdateTaskResult => {
    const start = task.startDate as Date;
    const end = task.endDate as Date;
    const baseUrl = BASE_URL;

    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description ?? '',
      startYear: start.getFullYear(),
      startMonth: start.getMonth() + 1,
      startDay: start.getDate(),
      endYear: end.getFullYear(),
      endMonth: end.getMonth() + 1,
      endDay: end.getDate(),
      status: task.status,
      assignee: task.users
        ? {
            id: task.users.id,
            name: task.users.name,
            email: task.users.email,
            profileImage: task.users.profileImgUrl ?? null,
          }
        : null,
      tags: (task.taskWithTags ?? []).map((twt: any) => ({
        id: twt.tags.id,
        name: twt.tags.tag,
      })),
      attachments: task!.files.map((f: any) => `${baseUrl}${f.url}`),
      subTasks: (task.subTasks ?? []).map((st: any) => ({
        id: st.id,
        title: st.content,
        taskId: st.taskId,
        status: st.status,
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  };

  // 프로젝트에 할 일 생성
  createTask = async (userId: number, projectId: number, data: updateTaskBody) => {
    const startDate = new Date(data.startYear, data.startMonth - 1, data.startDay);
    const endDate = new Date(data.endYear, data.endMonth - 1, data.endDay);

    if (endDate < startDate) throw new CustomError(400, '잘못된 요청 입니다');

    const task = await this.repo.createTask({
      userId,
      projectId,
      title: data.title,
      status: data.status,
      startDate,
      endDate,
    });

    const taskId = task.id;

    if (data.tags.length > 0) {
      const normalizedTags = this.normalizeTags(data.tags);
      await this.repo.upsertTags(normalizedTags, taskId);
    }

    if (data.attachments.length > 0) {
      const attachments = data.attachments
        .map(toRelativeUploadPath)
        .filter((v): v is string => v !== null);
      await this.repo.createFiles(task.id, attachments);
    }

    const createTask = await this.repo.findTaskWithRelations(task.id);

    // 구글 캘린더 생성 연동
    try {
      const googleAccessToken = await getGoogleAccessTokenFromRefresh(userId);
      if (!googleAccessToken) throw new CustomError(404, '데이터 조회 실패');
      const event = await GoogleCalendar.createCalendarEvent(googleAccessToken, {
        title: task.title,
        description: task.description || '',
        startDate: task.startDate,
        endDate: task.endDate,
      });
      await this.repo.updateTaskEventId(task.id, event.id);
      console.log(event);
    } catch (e) {
      console.log(e);
    }

    return this.mapResponse(createTask);
  };

  // 프로젝트의 할 일 목록 조회
  getTaskList = async (
    projectId: number,
    query: {
      page: number;
      limit: number;
      status?: 'todo' | 'in_progress' | 'done';
      assignee?: number;
      keyword?: string;
      order: 'asc' | 'desc';
      order_by: 'created_at' | 'name' | 'end_date';
    },
  ) => {
    const { data, total } = await this.repo.findManyWithTotal({
      projectId,
      ...query,
    });

    return {
      data: data.map((task: any) => this.mapResponse(task)),
      total,
    };
  };

  // 할 일 상세 조회
  getTaskById = async (taskId: number) => {
    const task = await this.repo.findTaskInfoById(taskId);

    if (!task) {
      throw new CustomError(404, '존재하지 않는 Task 입니다.');
    }

    return this.mapResponse(task);
  };

  // 할 일 수정
  updateTask = async (taskId: number, data: updateTaskBody) => {
    const startDate = new Date(data.startYear, data.startMonth - 1, data.startDay);
    const endDate = new Date(data.endYear, data.endMonth - 1, data.endDay);

    if (endDate < startDate) throw new CustomError(400, '잘못된 요청 입니다');

    // 1. task 기본 정보 수정
    await this.repo.updateTaskCore({
      taskId,
      title: data.title,
      description: data.description ?? '',
      status: data.status as TaskStatus,
      startDate: isNaN(startDate.getTime()) ? undefined : startDate,
      endDate: isNaN(endDate.getTime()) ? undefined : endDate,
      assigneeId: data.assigneeId,
    });

    // 2. task에 연동 된 tag 수정
    const normalizedTags = this.normalizeTags(data.tags);
    await this.repo.upsertTags(normalizedTags, taskId);

    // 3. task에 연동 된 file 수정
    const attachments = data.attachments
      .map(toRelativeUploadPath)
      .filter((v): v is string => v !== null);

    await this.repo.replaceTaskFiles(taskId, attachments ?? []);

    // 모든 작업이 마친 뒤 업데이트 된 정보 불러오기
    const updated = await this.repo.findTaskWithRelations(taskId);
    if (!updated) throw new CustomError(400, '데이터가 존재하지 않습니다');

    // 구글 캘린더 업데이트 연동
    try {
      if (updated.calendarId !== null) {
        const googleAccessToken = await getGoogleAccessTokenFromRefresh(updated.userId);
        if (!googleAccessToken) throw new CustomError(404, '데이터 조회 실패');
        const event = await GoogleCalendar.updateCalendarEvent(
          googleAccessToken,
          updated.calendarId!,
          {
            title: updated.title,
            description: updated.description || '',
            startDate: updated.startDate,
            endDate: updated.endDate,
          },
        );
        console.log(event);
      }
    } catch (e) {
      console.log(e);
    }

    return this.mapResponse(updated);
  };

  // 할 일 삭제
  deleteTask = async (taskId: number) => {
    // 구글 캘린더 삭제 연동
    try {
      const checkEventId = await this.repo.findTaskInfoById(taskId);
      if (checkEventId && checkEventId.calendarId !== null) {
        const googleAccessToken = await getGoogleAccessTokenFromRefresh(checkEventId?.userId);
        if (!googleAccessToken) throw new CustomError(404, '데이터 조회 실패');
        const event = await GoogleCalendar.deleteCalendarEvent(
          googleAccessToken,
          checkEventId.calendarId,
        );
        console.log(event);
      }
    } catch (e) {
      console.log(e);
    }

    return this.repo.deleteTaskById(taskId);
  };
}
