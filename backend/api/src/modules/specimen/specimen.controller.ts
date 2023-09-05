import {
  Controller,
  Get,
  Post,
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
import { Response, Express } from "express";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "modules/auth/role.enum";
import { CreateSpecimenDto, UpdateSpecimenDto } from "./specimen.dto";
import { Specimen } from "./specimen.entity";
import { SpecimenService } from "./specimen.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { getUserIdFromRequest } from "modules/utils/user.request";
import { RequestWithUser } from "modules/auth/request-with-user.interface";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { PaginationDto } from "modules/utils/pagination.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { ENV_VAR } from "config";

@ApiTags("Ejemplares")
@Controller("specimen")
export class SpecimenController {
  constructor(private readonly _specimenService: SpecimenService) {}
  private readonly _logger = new Logger(SpecimenController.name);

  @Post()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del ejemplar",
    type: CreateSpecimenDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Specimen,
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
    @Body() createSpecimenDto: CreateSpecimenDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Specimen> {
    this._logger.debug("POST: /api/specimen");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "coverImg") {
          createSpecimenDto.coverImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (
            createSpecimenDto.galleryImg &&
            createSpecimenDto.galleryImg.length > 0
          )
            createSpecimenDto.galleryImg = [
              ...createSpecimenDto.galleryImg,
              file,
            ];
          else createSpecimenDto.galleryImg = [file];
        }
      });
    }
    return this._specimenService.create(createSpecimenDto, userId);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del ejemplar",
    type: UpdateSpecimenDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Specimen,
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
  update(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
    @Body() updateSpecimenDto: UpdateSpecimenDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Specimen> {
    this._logger.debug("PATCH: /api/specimen");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "coverImg") {
          updateSpecimenDto.coverImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (
            updateSpecimenDto.galleryImg &&
            updateSpecimenDto.galleryImg.length > 0
          )
            updateSpecimenDto.galleryImg = [
              ...updateSpecimenDto.galleryImg,
              file,
            ];
          else updateSpecimenDto.galleryImg = [file];
        }
      });
    }
    return this._specimenService.update(updateSpecimenDto, userId);
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
  ): Promise<Pagination<Specimen> | Specimen[]> {
    this._logger.debug("GET: /api/post");
    if (paginationDto.page && paginationDto.limit) {
      return this._specimenService.findPaginated({
        page: paginationDto.page,
        limit: paginationDto.limit,
        orderBy: paginationDto.orderBy,
        orderDirection: paginationDto.orderDirection,
        route: `${ENV_VAR.EXTERNAL_LINK}/api/post`,
      });
    } else {
      return this._specimenService.findAll();
    }
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Specimen,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  async findOne(
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<Specimen> {
    this._logger.debug("GET: /api/specimen/:id");
    response.status(HttpStatus.OK);
    return this._specimenService.findOne(id);
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
    this._logger.debug("DELETE: /api/specimen/:id");
    const userId: number = getUserIdFromRequest(request);
    return this._specimenService.delete(id, userId);
  }
}
