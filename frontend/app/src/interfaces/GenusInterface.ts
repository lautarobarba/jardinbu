import { Family } from './FamilyInterface';

export interface Genus {
  id: number;
  name: string;
  description: string;
  family: Family;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface CreateGenusDto {
  name: string;
  description?: string;
  familyId: number;
}

export interface UpdateGenusDto {
  id: number;
  name?: string;
  description?: string;
  familyId?: number;
}
