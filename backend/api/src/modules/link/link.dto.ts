import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLinkDto {
  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  tagsIds: number;
}

export class UpdateLinkDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    type: "number",
    isArray: true,
  })
  tagsIds: number;
}
