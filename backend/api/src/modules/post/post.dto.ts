import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty()
  spanishTitle: string;

  @ApiPropertyOptional()
  englishTitle?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  coverImg?: Express.Multer.File;

  @ApiProperty()
  spanishContent: string;

  @ApiPropertyOptional()
  englishContent?: string;

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  tagsIds: number;

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

export class UpdatePostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  spanishTitle: string;

  @ApiPropertyOptional()
  englishTitle?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
  })
  coverImg?: Express.Multer.File;

  @ApiProperty()
  spanishContent: string;

  @ApiPropertyOptional()
  englishContent?: string;

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  tagsIds: number;

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
