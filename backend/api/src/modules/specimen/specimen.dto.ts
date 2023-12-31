import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Express } from "express";

export class CreateSpecimenDto {
  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  speciesId: number;

  @ApiPropertyOptional()
  coordLat?: string;

  @ApiPropertyOptional()
  coordLon?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  coverImg?: Express.Multer.File;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    isArray: true,
  })
  galleryImg?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  linksIds: number;
}

export class UpdateSpecimenDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  speciesId: number;

  @ApiPropertyOptional()
  coordLat?: string;

  @ApiPropertyOptional()
  coordLon?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  coverImg?: Express.Multer.File;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    isArray: true,
  })
  galleryImg?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  linksIds: number;
}
