export interface Family {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface CreateFamilyDto {
  name: string;
  description?: string;
}

export interface UpdateFamilyDto {
  id: number;
  name?: string;
  description?: string;
}
