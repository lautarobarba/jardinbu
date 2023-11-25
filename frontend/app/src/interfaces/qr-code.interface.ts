import { formatTitleCase } from "../utils/tools";
import { User } from "./user.interface";

export interface QRCode {
  id: number;
  uuid: string;
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  // userMod: User;
}

export interface CreateQRCodeDto {
  title: string;
  link: string;
}

export interface UpdateQRCodeDto extends CreateQRCodeDto {
  id: number;
}

export const qRCodeToString = (qRCode: QRCode) => {
  return `${formatTitleCase(qRCode.title)}`;
};
