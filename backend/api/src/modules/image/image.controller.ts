import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Res,
  UseInterceptors,
  HttpStatus,
  StreamableFile,
  Logger,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request, Express } from "express";
import { ImageService } from "./image.service";
import { Image } from "./image.entity";
import { createReadStream } from "fs";
import { join } from "path";

@Controller("image")
@ApiTags("Imágenes")
export class ImageController {
  constructor(private readonly _imageService: ImageService) {}
  private readonly _logger = new Logger(ImageController.name);

  @Get("by-id/:id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Image,
    isArray: false,
  })
  async findOneById(
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<StreamableFile> {
    this._logger.debug("GET: /api/image/by-id/:id");
    const image: Image = await this._imageService.findOneById(id);

    const stream = createReadStream(join(process.cwd(), image.path));
    response.set({
      "Content-Disposition": `inline; filename="${image.fileName}"`,
      "Content-Type": image.mimetype,
    });
    return new StreamableFile(stream);
  }

  @Get("by-uuid/:uuid")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Image,
    isArray: false,
  })
  async findOneByUUID(
    @Res({ passthrough: true }) response: Response,
    @Param("uuid") uuid: string
  ): Promise<StreamableFile> {
    this._logger.debug("GET: /api/image/by-id/:id");
    const image: Image = await this._imageService.findOneByUUID(uuid);

    const stream = createReadStream(join(process.cwd(), image.path));
    response.set({
      "Content-Disposition": `inline; filename="${image.fileName}"`,
      "Content-Type": image.mimetype,
    });
    return new StreamableFile(stream);
  }
}
