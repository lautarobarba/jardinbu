export interface Image {
  id: number;
  uuid: string;
  fileName: string;
  path: string;
  mimetype: string;
  originalName: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  fileDeleted: boolean;
}
