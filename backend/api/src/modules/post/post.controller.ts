import {
  Controller,
  Get,
  Post as PostDecorator,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Req,
  Res,
  Logger,
  UseGuards,
  Query,
  UploadedFiles,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "modules/auth/role.enum";
import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { Post } from "./post.entity";
import { PostService } from "./post.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { RequestWithUser } from "modules/auth/request-with-user.interface";
import { getUserIdFromRequest } from "modules/utils/user.request";
import { Pagination } from "nestjs-typeorm-paginate";
import { PaginationDto } from "modules/utils/pagination.dto";
import { ENV_VAR } from "config";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@ApiTags("Post")
@Controller("post")
export class PostController {
  constructor(private readonly _postService: PostService) {}
  private readonly _logger = new Logger(PostController.name);

  @PostDecorator()
  @UseGuards(RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del post",
    type: CreatePostDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Post,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.FALTAN_PERMISOS,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: ERROR_MESSAGE.NO_ACEPTABLE,
  })
  async create(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Post> {
    this._logger.debug("POST: /api/post");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "coverImg") {
          createPostDto.coverImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (createPostDto.galleryImg && createPostDto.galleryImg.length > 0)
            createPostDto.galleryImg = [...createPostDto.galleryImg, file];
          else createPostDto.galleryImg = [file];
        }
      });
    }
    return this._postService.create(createPostDto, userId);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del post",
    type: UpdatePostDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Post,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.FALTAN_PERMISOS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: ERROR_MESSAGE.NO_ACEPTABLE,
  })
  async update(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Post> {
    this._logger.debug("PATCH: /api/post");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "coverImg") {
          updatePostDto.coverImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (updatePostDto.galleryImg && updatePostDto.galleryImg.length > 0)
            updatePostDto.galleryImg = [...updatePostDto.galleryImg, file];
          else updatePostDto.galleryImg = [file];
        }
      });
    }
    return this._postService.update(updatePostDto, userId);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Post,
    isArray: true,
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<Pagination<Post> | Post[]> {
    this._logger.debug("GET: /api/post");
    if (paginationDto.page && paginationDto.limit) {
      return this._postService.findPaginated({
        page: paginationDto.page,
        limit: paginationDto.limit,
        orderBy: paginationDto.orderBy,
        orderDirection: paginationDto.orderDirection,
        route: `${ENV_VAR.EXTERNAL_LINK}/api/post`,
      });
    } else {
      return this._postService.findAll();
    }
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Post,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  async findOne(
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<Post> {
    this._logger.debug("GET: /api/post/:id");
    response.status(HttpStatus.OK);
    return this._postService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseGuards(IsEmailConfirmedGuard())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.FALTAN_PERMISOS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: ERROR_MESSAGE.OBJETO_REFERENCIADO,
  })
  async delete(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<void> {
    this._logger.debug("DELETE: /api/post/:id");
    const userId: number = getUserIdFromRequest(request);
    return this._postService.delete(id, userId);
  }
}
