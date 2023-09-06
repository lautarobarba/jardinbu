import { formatTitleCase } from "../utils/tools";
import { User } from "./user.interface";

export enum BGColor {
  tagBgGreen = "tagBgGreen",
  tagBgBlue = "tagBgBlue",
  tagBgJade = "tagBgJade",
  tagBgLima = "tagBgLima",
  tagBgPink = "tagBgPink",
  tagBgYellow = "tagBgYellow",
  tagBgRed = "tagBgRed",
  tagBgGrey = "tagBgGrey",
  tagBgPurple = "tagBgPurple",
}

export interface Tag {
  id: number;
  name: string;
  bgColor: BGColor;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  userMod: User;
}

export interface CreateTagDto {
  name: string;
  bgColor?: BGColor;
}

export interface UpdateTagDto extends CreateTagDto {
  id: number;
}

export const tagToString = (tag: Tag) => {
  return tag.name;
};
