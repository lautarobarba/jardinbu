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
} from "@nestjs/common";
import { Response, Express } from "express";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GenusService } from "./genus.service";
import { CreateGenusDto, UpdateGenusDto } from "./genus.dto";
import { Genus } from "./genus.entity";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "modules/auth/role.enum";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { RequestWithUser } from "modules/auth/request-with-user.interface";
import { getUserIdFromRequest } from "modules/utils/user.request";
import { PaginatedList, PaginationDto } from "modules/utils/pagination.dto";

@ApiTags("Géneros")
@Controller("genus")
export class GenusController {
  constructor(private readonly _genusService: GenusService) {}
  private readonly _logger = new Logger(GenusController.name);

  @Post()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del género",
    type: CreateGenusDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Genus,
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
    @Body() createGenusDto: CreateGenusDto
  ): Promise<Genus> {
    this._logger.debug("POST: /api/genus");
    const userId: number = getUserIdFromRequest(request);
    return this._genusService.create(createGenusDto, userId);
  }

  @Patch()
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiBody({
    description: "Atributos del género",
    type: UpdateGenusDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Genus,
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
    @Body() updateGenusDto: UpdateGenusDto
  ): Promise<Genus> {
    this._logger.debug("PATCH: /api/genus");
    const userId: number = getUserIdFromRequest(request);
    return this._genusService.update(updateGenusDto, userId);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Genus,
    isArray: true,
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedList<Genus>> {
    this._logger.debug("GET: /api/genus");
    return this._genusService.findAll(paginationDto);
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Genus,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  async findOne(
    @Res({ passthrough: true }) response: Response,
    @Param("id") id: number
  ): Promise<Genus> {
    this._logger.debug("GET: /api/genus/:id");
    response.status(HttpStatus.OK);
    return this._genusService.findOne(id);
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
    this._logger.debug("DELETE: /api/genus/:id");
    const userId: number = getUserIdFromRequest(request);
    return this._genusService.delete(id, userId);
  }
}
