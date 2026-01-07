interface ProjectResult {
  id: number;
  projectName: string;
  description: string;
  _count: {
    projectMembers: number;
  };
}

interface TaskCounts {
  todo: number;
  in_progress: number;
  done: number;
}

export const mapResponse = (project: ProjectResult, taskCounts: TaskCounts) => {
  return {
    id: project.id,
    name: project.projectName,
    description: project.description,
    memberCount: project._count.projectMembers,
    todoCount: taskCounts.todo,
    inProgressCount: taskCounts.in_progress,
    doneCount: taskCounts.done,
  };
};
