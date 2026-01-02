const TASK_STATUS = ['todo', 'in_progress', 'done'] as const;
type TaskStatus = (typeof TASK_STATUS)[number];

export function mapStatusCount(grouped: { status: TaskStatus; _count?: { status?: number } }[]) {
  return {
    todo: grouped.find((g) => g.status === 'todo')?._count?.status ?? 0,
    in_progress: grouped.find((g) => g.status === 'in_progress')?._count?.status ?? 0,
    done: grouped.find((g) => g.status === 'done')?._count?.status ?? 0,
  };
}
/* groupedTask 예시 
  [
  { _count: { status: 2 }, status: 'todo' },
  { _count: { status: 2 }, status: 'in_progress' },
  { _count: { status: 1 }, status: 'done' }
   ] 
  */
