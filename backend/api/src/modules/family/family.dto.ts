import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFamilyDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;
}

export class UpdateFamilyDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;
}
