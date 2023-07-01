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
import { PaginatedList, PaginationDto } from "modules/utils/pagination.dto";
import { LocalFilesInterceptor } from "modules/utils/localFiles.interceptor";

@ApiTags("Especies")
@Controller("species")
export class SpeciesController {
  constructor(private readonly _speciesService: SpeciesService) {}
  private readonly _logger = new Logger(SpeciesController.name);

  @Post()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: "exampleImg",
      path: "/temp",
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes("image")) {
          return callback(new BadRequestException("Invalid image file"), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    })
  )
  // @UseInterceptors(
  //   LocalFilesInterceptor({
  //     fieldName: "foliageImg",
  //     path: "/temp",
  //     fileFilter: (request, file, callback) => {
  //       if (!file.mimetype.includes("image")) {
  //         return callback(new BadRequestException("Invalid image file"), false);
  //       }
  //       callback(null, true);
  //     },
  //     limits: {
  //       fileSize: 1024 * 1024 * 10, // 10MB
  //     },
  //   })
  // )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Atributos de la especie",
    type: CreateSpeciesDto,
  })
  @ApiBearerAuth()
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
    @UploadedFile() exampleImg?: Express.Multer.File
    // @UploadedFile() foliageImg?: Express.Multer.File
  ): Promise<Species> {
    this._logger.debug("POST: /api/species");
    const userId: number = getUserIdFromRequest(request);

    // Agrego las fotos al DTO para enviarlo al service
    createSpeciesDto.exampleImg = exampleImg;
    // createSpeciesDto.foliageImg = foliageImg;

    return this._speciesService.create(createSpeciesDto, userId);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
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
    @Body() updateSpeciesDto: UpdateSpeciesDto
  ) {
    this._logger.debug("PATCH: /api/species");
    const userId: number = getUserIdFromRequest(request);
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
  ): Promise<PaginatedList<Species>> {
    this._logger.debug("GET: /api/species");
    return this._speciesService.findAll(paginationDto);
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
  @UseGuards(RoleGuard([Role.ADMIN]))
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
