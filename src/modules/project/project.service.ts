import { ProjectRepo } from './project.repo';
import { Project } from '../../types/project';
import { CustomError } from '../../libs/error';
import { mapStatusCount } from './utils/project.mapper';
import { mapResponse } from './dto/project.dto';

type CreateProject = Pick<Project, 'description'> & { name: string };
type PatchProject = Partial<CreateProject>;

export class ProjectService {
  constructor(private repo: ProjectRepo) {}

  // 프로젝트 생성
  createProject = async (data: CreateProject, userId: number) => {
    const { name, description } = data;

    const project = await this.repo.createProject({
      data: {
        projectName: name,
        description,
        ownerId: userId,
        projectMembers: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId: project.id },
      _count: { status: true },
    });

    const taskCounts = mapStatusCount(groupedTask);
    const response = mapResponse(project, taskCounts);
    return response;
  };

  /* 프로젝트 상세 조회  */
  getProject = async (projectId: number) => {
    const project = await this.repo.getProject({ where: { id: projectId } });
    if (!project) {
      throw new CustomError(404, '');
    }
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId },
      _count: { status: true },
    });
    const taskCounts = mapStatusCount(groupedTask);
    const response = mapResponse(project, taskCounts);
    return response;
  };

  /* 프로젝트 수정 */
  patchProject = async (projectId: number, data: PatchProject) => {
    const { name, description } = data;
    const project = await this.repo.patchProject({
      data: { projectName: name, description },
      where: { id: projectId },
    });
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId },
      _count: { status: true },
    });

    const taskCounts = mapStatusCount(groupedTask);
    const response = mapResponse(project, taskCounts);
    return response;
  };

  /* 프로젝트 삭제 */
  deleteProject = async (projectId: number) => {
    const project = await this.repo.deleteProject({
      where: { id: projectId },
    });
    if (!project) {
      throw new CustomError(404, '');
    }
  };
}
