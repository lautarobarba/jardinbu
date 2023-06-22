import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Express } from "express";
import { FoliageType, Origin, Status } from "./species.entity";

export class CreateSpeciesDto {
  @ApiProperty()
  scientificName: string;

  @ApiPropertyOptional()
  commonName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  genusId: number;

  @ApiPropertyOptional()
  status?: Status;

  @ApiPropertyOptional()
  origin?: Origin;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  exampleImg?: Express.Multer.File;

  @ApiPropertyOptional()
  foliageType?: FoliageType;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  foliageImg?: Express.Multer.File;
}

export class UpdateSpeciesDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  scientificName?: string;

  @ApiPropertyOptional()
  commonName?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  genusId?: number;

  @ApiPropertyOptional()
  status?: Status;

  @ApiPropertyOptional()
  origin?: Origin;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  exampleImg?: Express.Multer.File;

  @ApiPropertyOptional()
  foliageType?: FoliageType;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  foliageImg?: Express.Multer.File;
}
