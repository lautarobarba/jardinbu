import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Express } from "express";
import { FoliageType, OrganismType, Presence, Status } from "./species.entity";
import { Link } from "modules/link/link.entity";
import { CreateLinkDto, UpdateLinkDto } from "modules/link/link.dto";

export class CreateSpeciesDto {
  @ApiProperty()
  scientificName: string;

  @ApiPropertyOptional()
  commonName?: string;

  @ApiPropertyOptional()
  englishName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  genusId: number;

  @ApiProperty()
  organismType: OrganismType;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  foliageType: FoliageType;

  @ApiProperty()
  presence: Presence;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  exampleImg?: Express.Multer.File;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    isArray: true,
  })
  galleryImg?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: Link,
    isArray: true,
  })
  links: (CreateLinkDto | UpdateLinkDto)[];
}

export class UpdateSpeciesDto {
  @ApiProperty()
  id: number;

  scientificName: string;

  @ApiPropertyOptional()
  commonName?: string;

  @ApiPropertyOptional()
  englishName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  genusId: number;

  @ApiProperty()
  organismType: OrganismType;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  foliageType: FoliageType;

  @ApiProperty()
  presence: Presence;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  exampleImg?: Express.Multer.File;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    isArray: true,
  })
  galleryImg?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: Link,
    isArray: true,
  })
  links: (CreateLinkDto | UpdateLinkDto)[];
}
