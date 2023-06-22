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
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { Species } from "./species.entity";
import { GenusService } from "../genus/genus.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { PaginatedList, PaginationDto } from "modules/utils/pagination.dto";

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly _speciesRepository: Repository<Species>,
    private readonly _genusService: GenusService
  ) {}
  private readonly _logger = new Logger(SpeciesService.name);

  async create(
    createSpeciesDto: CreateSpeciesDto,
    userId: number
  ): Promise<Species> {
    // TODO: falta guardar imagenes
    this._logger.debug("create()");
    const {
      scientificName,
      commonName,
      description,
      genusId,
      status,
      origin,
      exampleImg,
      foliageType,
      foliageImg,
    } = createSpeciesDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que la nueva especie no exista
    const exists: Species = await this._speciesRepository.findOne({
      where: { scientificName: scientificName.toLowerCase() },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists && !exists.deleted) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const species: Species = this._speciesRepository.create();
    species.scientificName = scientificName.toLowerCase();
    species.commonName = commonName.toLowerCase();
    species.description = description.toLowerCase();
    if (genusId && genusId !== 0)
      species.genus = await this._genusService.findOne(genusId);
    else species.genus = null;
    species.status = status;
    species.origin = origin;
    species.foliageType = foliageType;
    species.createdAt = timestamp;
    species.updatedAt = timestamp;
    species.deleted = false;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(species);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._speciesRepository.save(species);
  }

  async update(
    updateSpeciesDto: UpdateSpeciesDto,
    userId: number
  ): Promise<Species> {
    this._logger.debug("update()");
    const {
      id,
      scientificName,
      commonName,
      description,
      genusId,
      status,
      origin,
      exampleImg,
      foliageType,
      foliageImg,
    } = updateSpeciesDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const species: Species = await this._speciesRepository.findOne({
      where: { id },
    });

    if (!species) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo que las claves no estén en uso
    if (scientificName) {
      const exists: Species = await this._speciesRepository.findOne({
        where: { scientificName: scientificName.toLowerCase() },
      });

      // Si existe y no esta borrado lógico entonces hay conflictos
      if (exists && !exists.deleted && exists.id !== id) {
        this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
        throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      }
    }

    // Si no hay problemas actualizo los atributos
    if (scientificName) species.scientificName = scientificName.toLowerCase();
    if (commonName) species.commonName = commonName.toLowerCase();
    if (description) species.description = description.toLowerCase();
    if (genusId && genusId !== 0)
      species.genus = await this._genusService.findOne(genusId);
    else species.genus = null;
    if (status) species.status = status;
    if (origin) species.origin = origin;
    if (foliageType) species.foliageType = foliageType;
    species.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(species);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._speciesRepository.save(species);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedList<Species>> {
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
    const count: number = await this._speciesRepository.count({
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

    // Busco las especies utilizando todos los filtros
    const species: Species[] = await this._speciesRepository.find({
      where: where,
      order: order,
      skip: skip,
      take: take,
    });

    const paginatedList: PaginatedList<Species> = {
      pageCount: pageCount,
      rows: species,
    };

    return paginatedList;
  }

  async findOne(id: number): Promise<Species> {
    this._logger.debug("findOne()");
    return this._speciesRepository.findOne({
      where: { id },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const species: Species = await this._speciesRepository.findOne({
      where: { id },
    });

    if (!species) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Soft Delete
    // species.deleted = true;
    // species.updatedAt = timestamp;
    // await this._speciesRepository.save(species);

    // Hard Delete
    await this._speciesRepository.remove(species);
  }
}
