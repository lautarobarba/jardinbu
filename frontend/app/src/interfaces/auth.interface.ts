export interface LoginUserDto {
  email: string;
  password: string;
}

export interface SessionDto {
  accessToken: string;
}

export interface RecoverPasswordDto {
  email: string;
}

export interface ChangePasswordDto {
  newPassword: string;
}
