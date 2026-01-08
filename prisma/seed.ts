import { PrismaClient, Role, TaskStatus, Provider } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  /* =========================
   * User
   * ========================= */
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@test.com`,
          password: 'hashed-password',
          name: `User${i + 1}`,
          profileImgUrl: `https://picsum.photos/200?random=${i + 1}`,
        },
      }),
    ),
  );

  /* =========================
   * Project
   * ========================= */
  const projects = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.project.create({
        data: {
          projectName: `Project ${i + 1}`,
          description: `Description for project ${i + 1}`,
          ownerId: users[0].id,
        },
      }),
    ),
  );

  /* =========================
   * ProjectMember
   * ========================= */
  await Promise.all(
    projects.flatMap((project) =>
      users.map((user, index) =>
        prisma.projectMember.create({
          data: {
            userId: user.id,
            projectId: project.id,
            role: index === 0 ? Role.owner : Role.member,
          },
        }),
      ),
    ),
  );

  /* =========================
   * Task
   * ========================= */
  const tasks = await Promise.all(
    projects.flatMap((project) =>
      Array.from({ length: 5 }).map((_, i) =>
        prisma.task.create({
          data: {
            title: `Task ${i + 1} of Project ${project.id}`,
            description: 'Task description',
            status:
              i % 3 === 0
                ? TaskStatus.todo
                : i % 3 === 1
                ? TaskStatus.in_progress
                : TaskStatus.done,
            userId: users[i % users.length].id,
            projectId: project.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        }),
      ),
    ),
  );

  /* =========================
   * SubTask
   * ========================= */
  await Promise.all(
    tasks.flatMap((task) =>
      Array.from({ length: 5 }).map((_, i) =>
        prisma.subTask.create({
          data: {
            taskId: task.id,
            content: `SubTask ${i + 1} of Task ${task.id}`,
            status: TaskStatus.todo,
          },
        }),
      ),
    ),
  );

  /* =========================
   * Comment
   * ========================= */
  await Promise.all(
    tasks.flatMap((task) =>
      Array.from({ length: 5 }).map((_, i) =>
        prisma.comment.create({
          data: {
            taskId: task.id,
            userId: users[i % users.length].id,
            content: `Comment ${i + 1} on Task ${task.id}`,
          },
        }),
      ),
    ),
  );

  /* =========================
   * Tag
   * ========================= */
  const tags = await Promise.all(
    ['backend', 'frontend', 'bug', 'urgent', 'feature'].map((tag) =>
      prisma.tag.create({
        data: { tag },
      }),
    ),
  );

  /* =========================
   * TaskWithTags
   * ========================= */
  await Promise.all(
    tasks.flatMap((task) =>
      tags.slice(0, 3).map((tag) =>
        prisma.taskWithTags.create({
          data: {
            taskId: task.id,
            tagId: tag.id,
          },
        }),
      ),
    ),
  );

  /* =========================
   * File
   * ========================= */
  await Promise.all(
    tasks.flatMap((task) =>
      Array.from({ length: 5 }).map((_, i) =>
        prisma.file.create({
          data: {
            taskId: task.id,
            url: `https://files.example.com/task-${task.id}-${i + 1}.png`,
          },
        }),
      ),
    ),
  );

  /* =========================
   * OAuth
   * ========================= */
  await Promise.all(
    users.map((user, i) =>
      prisma.oauth.create({
        data: {
          userId: user.id,
          provider: Provider.local,
          providerId: `local-${user.id}`,
          refreshToken: `refresh-token-${i}`,
          expirationAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      }),
    ),
  );

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
