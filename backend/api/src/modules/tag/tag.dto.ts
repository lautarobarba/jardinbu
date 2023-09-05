import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
  @ApiProperty()
  name: string;
}

export class UpdateTagDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
