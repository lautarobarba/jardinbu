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
  BadRequestException,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { Response, Express } from "express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "modules/auth/role.enum";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { Species } from "./species.entity";
import { SpeciesService } from "./species.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { RequestWithUser } from "modules/auth/request-with-user.interface";
import { getUserIdFromRequest } from "modules/utils/user.request";
import { PaginationDto } from "modules/utils/pagination.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { LocalFilesInterceptor } from "modules/utils/localFiles.interceptor";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ENV_VAR } from "config";

@ApiTags("Especies")
@Controller("species")
export class SpeciesController {
  constructor(private readonly _speciesService: SpeciesService) {}
  private readonly _logger = new Logger(SpeciesController.name);

  @Post()
  @UseGuards(RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Atributos de la especie",
    type: CreateSpeciesDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Species,
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
    @Body() createSpeciesDto: CreateSpeciesDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<Species> {
    this._logger.debug("POST: /api/species");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "exampleImg") {
          createSpeciesDto.exampleImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (
            createSpeciesDto.galleryImg &&
            createSpeciesDto.galleryImg.length > 0
          )
            createSpeciesDto.galleryImg = [
              ...createSpeciesDto.galleryImg,
              file,
            ];
          else createSpeciesDto.galleryImg = [file];
        }
      });
    }
    return this._speciesService.create(createSpeciesDto, userId);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(AnyFilesInterceptor({ dest: "uploads/temp" }))
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Atributos de la especie",
    type: UpdateSpeciesDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Species,
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
    @Body() updateSpeciesDto: UpdateSpeciesDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    this._logger.debug("PATCH: /api/species");
    const userId: number = getUserIdFromRequest(request);
    // Check files uploaded
    if (files && files.length > 0) {
      files.forEach((file) => {
        // TODO: check if the image is the same
        if (file.fieldname === "exampleImg") {
          updateSpeciesDto.exampleImg = file;
        }
        if (file.fieldname === "galleryImg[]") {
          if (
            updateSpeciesDto.galleryImg &&
            updateSpeciesDto.galleryImg.length > 0
          )
            updateSpeciesDto.galleryImg = [
              ...updateSpeciesDto.galleryImg,
              file,
            ];
          else updateSpeciesDto.galleryImg = [file];
        }
      });
    }
    console.log(updateSpeciesDto);
    throw new Error("CORTE");
    return this._speciesService.update(updateSpeciesDto, userId);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Species,
    isArray: true,
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<Pagination<Species> | Species[]> {
    this._logger.debug("GET: /api/species");
    if (paginationDto.page && paginationDto.limit) {
      return this._speciesService.findPaginated({
        page: paginationDto.page,
        limit: paginationDto.limit,
        orderBy: paginationDto.orderBy,
        orderDirection: paginationDto.orderDirection,
        searchKey: paginationDto.searchKey,
        route: `${ENV_VAR.EXTERNAL_LINK}/api/species`,
      });
    } else {
      if (paginationDto.searchKey && paginationDto.searchKey !== "") {
        return this._speciesService.search(paginationDto.searchKey);
      } else {
        return this._speciesService.findAll();
      }
    }
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Species,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  async findOne(
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<Species> {
    this._logger.debug("GET: /api/species/:id");
    response.status(HttpStatus.OK);
    return this._speciesService.findOne(id);
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
    this._logger.debug("DELETE: /api/species/:id");
    const userId: number = getUserIdFromRequest(request);
    return this._speciesService.delete(id, userId);
  }
}
