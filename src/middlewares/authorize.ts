import { Request, Response, NextFunction } from 'express';
import { MemberRepo } from '../modules/member/member.repo';
import { prisma } from '../libs/prisma';
import { CustomError } from '../libs/error';
import { unknown } from 'zod';

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
      if (!member) throw new CustomError(400, '프로젝트 멤버가 아닙니다');
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

  static taskOrSubtaskProjectMember = async (req: Request, res: Response, next: NextFunction) => {
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

  static commentAuthorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const { taskId, commentId } = req.params as unknown as {
        taskId?: number;
        commentId?: number;
      };
      let projectId: number | undefined;
      let commentUserId: number | undefined;
      // 1. 댓글 수정/삭제 요청인 경우 (commentId 존재)
      if (commentId) {
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
          include: { tasks: { select: { projectId: true } } },
        });
        if (!comment) throw new CustomError(404, '존재하지 않는 댓글입니다.');

        // 댓글 -> 태스크 -> 프로젝트 ID 추적
        projectId = comment.tasks.projectId;
        commentUserId = comment.userId;
      }

      // 2. 댓글 생성 요청인 경우 (taskId 존재)
      else if (taskId) {
        const task = await prisma.task.findUnique({
          where: { id: Number(taskId) },
          select: { projectId: true },
        });
        if (!task) throw new CustomError(404, '존재하지 않는 태스크입니다.');
        projectId = task.projectId;
      }

      // 3. 프로젝트 멤버 여부 확인 (공통 로직)
      if (!projectId) throw new CustomError(400, '잘못된 요청입니다.');

      const member = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!member) throw new CustomError(403, '프로젝트 멤버가 아닙니다.');
      if (commentId && commentUserId !== userId) {
        throw new CustomError(403, '자신이 작성한 댓글만 수정 및 삭제 할 수 있습니다');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  static googleCalendarLinked = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: user.googleRefreshToken 존재 확인
    next();
  };
}

const memberRepo = new MemberRepo();
