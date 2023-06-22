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
import { CreateFamilyDto, UpdateFamilyDto } from "./family.dto";
import { Family } from "./family.entity";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { PaginatedList, PaginationDto } from "modules/utils/pagination.dto";

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private readonly _familyRepository: Repository<Family>
  ) {}
  private readonly _logger = new Logger(FamilyService.name);

  async create(
    createFamilyDto: CreateFamilyDto,
    userId: number
  ): Promise<Family> {
    this._logger.debug("create()");
    const { name, description } = createFamilyDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que la nueva familia no exista
    const exists: Family = await this._familyRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists && !exists.deleted) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const family: Family = this._familyRepository.create();
    family.name = name.toLowerCase();
    family.description = description.toLowerCase();
    family.createdAt = timestamp;
    family.updatedAt = timestamp;
    family.deleted = false;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(family);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._familyRepository.save(family);
  }

  async update(
    updateFamilyDto: UpdateFamilyDto,
    userId: number
  ): Promise<Family> {
    this._logger.debug("update()");
    const { id, name, description } = updateFamilyDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const family: Family = await this._familyRepository.findOne({
      where: { id },
    });

    if (!family) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    if (name) {
      // Controlo que las claves no estén en uso
      const exists: Family = await this._familyRepository.findOne({
        where: { name: name.toLowerCase() },
      });

      // Si existe y no esta borrado lógico entonces hay conflictos
      if (exists && !exists.deleted && exists.id !== id) {
        this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
        throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      }
    }

    // Si no hay problemas actualizo los atributos
    if (name) family.name = name.toLowerCase();
    if (description) family.description = description.toLowerCase();
    family.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(family);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._familyRepository.save(family);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedList<Family>> {
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
    const count: number = await this._familyRepository.count({
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

    // Busco las familias utilizando todos los filtros
    const familias: Family[] = await this._familyRepository.find({
      where: where,
      order: order,
      skip: skip,
      take: take,
    });

    const paginatedList: PaginatedList<Family> = {
      pageCount: pageCount,
      rows: familias,
    };

    return paginatedList;
  }

  async findOne(id: number): Promise<Family> {
    this._logger.debug("findOne()");
    return this._familyRepository.findOne({
      where: { id },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const family: Family = await this._familyRepository.findOne({
      where: { id },
    });

    if (!family) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Soft Delete
    // family.deleted = true;
    // family.updatedAt = timestamp;
    // await this._familyRepository.save(family);

    // Hard Delete
    await this._familyRepository.remove(family);
  }
}
