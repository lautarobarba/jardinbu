import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as moment from "moment";
import { validate } from "class-validator";
import { FamilyService } from "../family/family.service";
import { Genus } from "./genus.entity";
import { CreateGenusDto, UpdateGenusDto } from "./genus.dto";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { PaginatedList, PaginationDto } from "modules/utils/pagination.dto";

@Injectable()
export class GenusService {
  constructor(
    @InjectRepository(Genus)
    private readonly _genusRepository: Repository<Genus>,
    private readonly _familyService: FamilyService
  ) {}
  private readonly _logger = new Logger(GenusService.name);

  async create(createGenusDto: CreateGenusDto, userId: number): Promise<Genus> {
    this._logger.debug("create()");
    const { name, description, familyId } = createGenusDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que el nuevo genero no exista
    const exists: Genus = await this._genusRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists && !exists.deleted) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const genus: Genus = this._genusRepository.create();
    genus.name = name.toLowerCase();
    genus.description = description.toLowerCase();
    if (familyId && familyId !== 0)
      genus.family = await this._familyService.findOne(familyId);
    else genus.family = null;
    genus.createdAt = timestamp;
    genus.updatedAt = timestamp;
    genus.deleted = false;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(genus);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._genusRepository.save(genus);
  }

  async update(updateGenusDto: UpdateGenusDto, userId: number): Promise<Genus> {
    this._logger.debug("update()");
    const { id, name, description, familyId } = updateGenusDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const genus: Genus = await this._genusRepository.findOne({
      where: { id },
    });

    if (!genus) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    if (name) {
      // Controlo que las claves no estén en uso
      const exists: Genus = await this._genusRepository.findOne({
        where: { name: name.toLowerCase() },
      });

      // Si existe y no esta borrado lógico entonces hay conflictos
      if (exists && !exists.deleted && exists.id !== id) {
        this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
        throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      }
    }

    // Si no hay problemas actualizo los atributos
    if (name) genus.name = name.toLowerCase();
    if (description) genus.description = description.toLowerCase();
    if (familyId && familyId !== 0)
      genus.family = await this._familyService.findOne(familyId);
    else genus.family = null;
    genus.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(genus);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._genusRepository.save(genus);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedList<Genus>> {
    this._logger.debug("findAll()");
    const { paginationState, sortingState, columnFiltersState } = paginationDto;

    const tieneFiltros: boolean =
      columnFiltersState && columnFiltersState.length > 0 ? true : false;
    const tienePaginado: boolean =
      paginationState && paginationState.pageSize && paginationState.pageIndex
        ? true
        : false;
    const tieneOrdenamiento: boolean =
      sortingState && sortingState.length > 0 ? true : false;

    // Preparo filtros
    let where: any = {};

    // Preparo paginado
    const count: number = await this._genusRepository.count({
      where: where,
    }); // COUNT(*)
    let skip: number = 0;
    let take: number = count;
    let pageCount: number = 1;
    if (tienePaginado) {
      skip = paginationState.pageIndex * paginationState.pageSize;
      take = paginationState.pageSize;
      pageCount = Math.ceil(count / paginationState.pageSize);
    }

    // Preparo ordenamiento
    let order: any = {};
    if (tieneOrdenamiento) {
      sortingState.map((field: any) => {
        if (field.id.split(".").length === 1) {
          // console.log('Es una prop de la entidad');
          order = {
            ...order,
            [field.id]: field.desc === "true" ? "DESC" : "ASC",
          };
          // console.log({[field.id]: field.desc ? 'DESC' : 'ASC' });
        } else if (field.id.split(".").length === 2) {
          // console.log('Es una prop de relacion');
          const [relacion, attributo] = field.id.split(".");
          order = {
            ...order,
            [relacion]: { [attributo]: field.desc === "true" ? "DESC" : "ASC" },
          };
          // console.log({ ...order, [relacion]: { [attributo]: field.desc === 'true' ? 'DESC' : 'ASC' } });
        } else if (field.id.split(".").length === 3) {
          console.log("Es una prop de relacion de relacion");
          const [relacion1, relacion2, attributo] = field.id.split(".");
          order = {
            ...order,
            [relacion1]: {
              [relacion2]: {
                [attributo]: field.desc === "true" ? "DESC" : "ASC",
              },
            },
          };
          // console.log({ ...order, [relacion1]: { [relacion2]: { [attributo]: field.desc === 'true' ? 'DESC' : 'ASC' } } });
        }
      });
    }
    // Si no tiene la prop id entonces agrego id: 'DESC' por default
    if (order.id === undefined) order = { ...order, id: "DESC" };
    // console.log(order);

    // Busco los generos utilizando todos los filtros
    const generos: Genus[] = await this._genusRepository.find({
      where: where,
      order: order,
      skip: skip,
      take: take,
    });

    const paginatedList: PaginatedList<Genus> = {
      pageCount: pageCount,
      rows: generos,
    };

    return paginatedList;
  }

  async findOne(id: number): Promise<Genus> {
    this._logger.debug("findOne()");
    return this._genusRepository.findOne({
      where: { id },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const genus: Genus = await this._genusRepository.findOne({
      where: { id },
    });

    if (!genus) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Soft Delete
    // genus.deleted = true;
    // genus.updatedAt = timestamp;
    // await this._genusRepository.save(genus);

    // Hard Delete
    await this._genusRepository.remove(genus);
  }
}
