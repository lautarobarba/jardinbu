import { Image } from "./image.interface";

export enum Role {
  USER = "USER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  id: number;
  email: string;
  isEmailConfirmed: boolean;
  firstname: string;
  lastname: string;
  profilePicture?: Image;
  status: Status;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface UpdateUserDto {
  id: number;
  isEmailConfirmed?: boolean;
  firstname?: string;
  lastname?: string;
  profilePicture?: Image | null;
  status?: Status;
  role?: Role;
}

export const userToString = (user: User) => {
  return `${user.firstname} ${user.lastname}`;
};
