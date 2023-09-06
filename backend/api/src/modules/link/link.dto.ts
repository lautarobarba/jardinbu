import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Tag } from "modules/tag/tag.entity";

export class CreateLinkDto {
  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    type: Tag,
    isArray: true,
  })
  tags: Tag[];
}

export class UpdateLinkDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    type: Tag,
    isArray: true,
  })
  tags: Tag[];;
}
