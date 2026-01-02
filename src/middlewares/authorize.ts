import { Request, Response, NextFunction } from 'express';
import { MemberRepo } from '../modules/member/member.repo';
import { prisma } from '../libs/prisma';
import { CustomError } from '../libs/error';

export class Authorize {
  static projectOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, invitationId } = req.params;
      if (!projectId && !invitationId) throw new CustomError(404, '잘못된 요청 형식');
      const operatorId = req.user.id;
      let pid: number | undefined;
      if (projectId) pid = Number(projectId);
      if (invitationId) {
        const iid = await memberRepo.findProjectIdByInvitationId(Number(invitationId));
        pid = iid;
      }
      if (!pid) throw new CustomError(400, '잘못된 요청 형식');
      const member = await memberRepo.findProjectMember(pid, operatorId);
      if (!member) throw new CustomError(400, '잘못된 요청 형식');
      if (member.role !== 'owner') throw new CustomError(403, '프로젝트 관리자가 아닙니다');
      next();
    } catch (e) {
      next(e);
    }
  };
  static existingProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params as unknown as { projectId: number };
      const userId = req.user.id;
      const existingOwner = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });
      if (!existingOwner) {
        throw new CustomError(404, '');
      }
      if (existingOwner.role !== 'owner') {
        throw new CustomError(403, '프로젝트 관리자가 아닙니다.');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  static projectMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params as unknown as { projectId: number };
      const userId = req.user.id;

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        throw new CustomError(404, '');
      }
      const existingMember = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!existingMember) {
        throw new CustomError(403, '프로젝트 멤버가 아닙니다.');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  static subtaskProjectMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId, subtaskId } = req.params;
      const userId = req.user.id;

      let projectId: number | undefined;

      if (taskId) {
        const task = await prisma.task.findUnique({
          where: { id: Number(taskId) },
          select: { projectId: true },
        });
        if (!task) throw new CustomError(400, '잘못된 요청 형식');
        projectId = task.projectId;
      }

      if (subtaskId) {
        const subtask = await prisma.subTask.findUnique({
          where: { id: Number(subtaskId) },
          select: { tasks: { select: { projectId: true } } },
        });
        if (!subtask) throw new CustomError(400, '잘못된 요청 형식');
        projectId = subtask.tasks.projectId;
      }

      const member = await prisma.projectMember.findFirst({
        where: { projectId, userId },
      });

      if (!member) throw new CustomError(403, '프로젝트 멤버가 아닙니다');

      next();
    } catch (err) {
      next(err);
    }
  };

  static ownerOnly = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: 댓글 등 작성자 확인
    next();
  };

  static googleCalendarLinked = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: user.googleRefreshToken 존재 확인
    next();
  };
}

const memberRepo = new MemberRepo();
