export interface User {
  id: number;
  email: string;
  name: string;
  password: string | null;
  profileImgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  profileImgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
