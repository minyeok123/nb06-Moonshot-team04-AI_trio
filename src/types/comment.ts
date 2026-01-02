export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
