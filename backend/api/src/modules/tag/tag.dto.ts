import { ApiProperty } from "@nestjs/swagger";
import { BGColor } from "./tag.entity";

export class CreateTagDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  bgColor: BGColor;
}

export class UpdateTagDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  bgColor: BGColor;
}
