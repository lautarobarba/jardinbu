import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateQRCodeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;
}

export class UpdateQRCodeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;
}
