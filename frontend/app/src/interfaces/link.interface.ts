import { formatTitleCase } from "../utils/tools";
import { CreateTagDto, Tag } from "./tag.interface";
import { User } from "./user.interface";

export interface Link {
  id: number;
  url: string;
  description: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  userMod: User;
}

export interface CreateLinkDto {
  url: string;
  description: string;
  tags?: Tag[] | null;
}

export interface UpdateLinkDto extends CreateLinkDto {
  id: number;
}

export const linkToString = (link: Link) => {
  return link.url;
};
