export interface User {
  id: number;
  email: string;
  password: string | null;
  name: string;
  profileImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
