import { Genus } from './GenusInterface';
import { Picture } from './Picture';

export enum Status {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXTINCT = 'EXTINCT',
}

export enum Origin {
  NATIVE = 'NATIVE',
  INTRODUCED = 'INTRODUCED',
}

export enum FoliageType {
  PERENNE = 'PERENNE',
}

export interface Species {
  id: number;
  scientificName: string;
  commonName: string;
  description: string;
  genus: Genus;
  status: Status;
  origin: Origin;
  exampleImg?: Picture;
  foliageType: FoliageType;
  foliageImg?: Picture;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface CreateSpeciesDto {
  scientificName: string;
  commonName?: string;
  description?: string;
  genusId: number;
  status?: string;
  origin?: string;
  foliageType?: string;
}

export interface UpdateSpeciesDto {
  id: number;
  scientificName?: string;
  commonName?: string;
  description?: string;
  genusId?: number;
  status?: string;
  origin?: string;
  foliageType?: string;
}
