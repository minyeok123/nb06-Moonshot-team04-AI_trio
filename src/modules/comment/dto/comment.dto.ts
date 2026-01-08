interface commentResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: number;
    name: string;
    email: string;
    profileImgUrl: string | null;
  };
  content: string;
  taskId: number;
}

export function mapResponse(comment: commentResponse) {
  return {
    id: comment.id,
    content: comment.content,
    taskId: comment.taskId,
    author: {
      id: comment.users.id,
      name: comment.users.name,
      email: comment.users.email,
      profileImage: comment.users?.profileImgUrl,
    },
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
