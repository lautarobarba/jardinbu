import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  UnauthorizedException,
  UploadedFile,
  StreamableFile,
  BadRequestException,
  Logger,
  Query,
  UploadedFiles,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response, Request, Express } from "express";
import { UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "../auth/role.enum";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";
import { LocalFilesInterceptor } from "modules/utils/localFiles.interceptor";
import { createReadStream } from "fs";
import { join } from "path";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { PaginationDto } from "modules/utils/pagination.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { ENV_VAR } from "config";
import { RequestWithUser } from "modules/auth/request-with-user.interface";
import { getUserIdFromRequest } from "modules/utils/user.request";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("user")
@ApiTags("Usuarios")
export class UserController {
  constructor(private readonly _userService: UserService) {}
  private readonly _logger = new Logger(UserController.name);

  @Patch()
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Atributos del usuario",
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
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
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<User> {
    this._logger.debug("PATCH: /api/user");
    // Sólo administradores y propietarios pueden editar
    const userId: number = getUserIdFromRequest(request);
    const user: User = await this._userService.findOneById(userId);

    if (
      user.role !== Role.ADMIN &&
      Number(user.id) !== Number(updateUserDto.id)
    ) {
      this._logger.debug(ERROR_MESSAGE.FALTAN_PERMISOS);
      throw new UnauthorizedException(ERROR_MESSAGE.FALTAN_PERMISOS);
    }

    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "profilePicture") {
          updateUserDto.profilePicture = file;
        }
      });
    }
    // console.log(updateUserDto);
    return this._userService.update(updateUserDto, userId);
  }

  @Get()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.FALTAN_PERMISOS,
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<Pagination<User> | User[]> {
    this._logger.debug("GET: /api/user");
    if (paginationDto.page && paginationDto.limit) {
      return this._userService.findPaginated({
        page: paginationDto.page,
        limit: paginationDto.limit,
        orderBy: paginationDto.orderBy,
        orderDirection: paginationDto.orderDirection,
        route: `${ENV_VAR.EXTERNAL_LINK}/api/user`,
      });
    } else {
      return this._userService.findAll();
    }
  }

  @Get(":id")
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.FALTAN_PERMISOS,
  })
  async findOne(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<User> {
    this._logger.debug("GET: /api/user/:id");
    // Sólo administradores y propietarios pueden editar
    const userId: number = getUserIdFromRequest(request);
    const user: User = await this._userService.findOneById(userId);

    if (user.role !== Role.ADMIN && Number(user.id) !== Number(id)) {
      this._logger.debug(ERROR_MESSAGE.FALTAN_PERMISOS);
      throw new UnauthorizedException(ERROR_MESSAGE.FALTAN_PERMISOS);
    }

    response.status(HttpStatus.OK);
    return this._userService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
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
    this._logger.debug("DELETE: /api/user/:id");
    const userId: number = getUserIdFromRequest(request);
    return this._userService.delete(id, userId);
  }
}
