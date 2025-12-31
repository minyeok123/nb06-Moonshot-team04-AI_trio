import { CustomError } from '../../libs/error';
import { SubtaskRepo } from './subtask.repo';

export class SubtaskService {
  constructor(private repo: SubtaskRepo) {}
  createSubtask = async (taskId: number, title: string) => {
    const subtask = await this.repo.createSubtask(taskId, title);
    if (!subtask) throw new CustomError(400, '데이터 생성 실패');
    const { content, ...rest } = subtask;
    return { ...rest, title: content };
  };

  getSubtasks = async (taskId: number) => {
    const subtasks = await this.repo.getSubtasks(taskId);
    if (!subtasks) throw new CustomError(404, '데이터 조회 실패');
    const subtaskCount = await this.repo.subtaskCount(taskId);
    if (!subtaskCount) throw new CustomError(400, '데이터 조회 실패');
    const formatted = subtasks.map((s) => ({
      id: s.id,
      title: s.content,
      taskId: s.taskId,
      status: s.status,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
    return { data: formatted, total: subtaskCount._count.subTasks };
  };

  getSubtask = async (subtaskId: number) => {
    const subtask = await this.repo.getSubtask(subtaskId);
    if (!subtask) throw new CustomError(404, '데이터 조회 실패');
    const { content, ...rest } = subtask;
    return { ...rest, title: content };
  };

  updateSubtask = async (subtaskId: number, title: string) => {
    const subtask = await this.repo.updateSubtask(subtaskId, title);
    if (!subtask) throw new CustomError(400, '데이터 수정 실패');
    const { content, ...rest } = subtask;
    return { ...rest, title: content };
  };

  deleteSubtask = async (subtaskId: number) => {
    const subtask = await this.repo.deleteSubtask(subtaskId);
    if (!subtask) throw new CustomError(400, '데이터 삭제 실패');
    const { content, ...rest } = subtask;
    return { ...rest, title: content };
  };
}
