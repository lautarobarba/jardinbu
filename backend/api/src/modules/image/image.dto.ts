import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateImageDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  originalPath: string;

  @ApiProperty()
  saveFolder: string;

  @ApiPropertyOptional()
  mimetype: string;

  @ApiPropertyOptional()
  originalName: string;
}

export class UpdateNoteDto extends CreateImageDto {
  @ApiProperty()
  id: number;
}
