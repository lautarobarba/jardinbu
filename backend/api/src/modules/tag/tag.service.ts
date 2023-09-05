import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository, ILike } from "typeorm";
import * as moment from "moment";
import { validate } from "class-validator";
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from "nestjs-typeorm-paginate";
import { CreateTagDto, UpdateTagDto } from "./tag.dto";
import { Tag } from "./tag.entity";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { UserService } from "modules/user/user.service";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly _tagRepository: Repository<Tag>,
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(TagService.name);

  async create(createTagDto: CreateTagDto, userId: number): Promise<Tag> {
    this._logger.debug("create()");
    const { name, bgColor } = createTagDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que la clave no esté en uso
    const exists: Tag = await this._tagRepository.findOne({
      where: { name: name.toLowerCase(), deleted: false },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const tag: Tag = this._tagRepository.create();
    tag.name = name.toLowerCase();
    tag.bgColor = bgColor ? bgColor : null;
    tag.createdAt = timestamp;
    tag.updatedAt = timestamp;
    tag.deleted = false;
    tag.userMod = await this._userService.findOne(userId);

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(tag);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._tagRepository.save(tag);
  }

  async update(updateTagDto: UpdateTagDto, userId: number): Promise<Tag> {
    this._logger.debug("update()");
    const { id, name, bgColor } = updateTagDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const tag: Tag = await this._tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo que la clave no esté en uso
    const exists: Tag = await this._tagRepository.findOne({
      where: { name: name.toLowerCase(), deleted: false, id: Not(id) },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no hay problemas actualizo los atributos
    tag.name = name.toLowerCase();
    tag.bgColor = bgColor ? bgColor : null;
    tag.createdAt = timestamp;
    tag.updatedAt = timestamp;
    tag.deleted = false;
    tag.userMod = await this._userService.findOne(userId);

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(tag);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._tagRepository.save(tag);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<Tag>> {
    this._logger.debug("findPaginated()");

    return paginate<Tag>(this._tagRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<Tag[]> {
    this._logger.debug("findAll()");

    return this._tagRepository.find({
      where: { deleted: false },
      order: { name: "ASC" },
    });
  }

  async findOne(id: number): Promise<Tag> {
    this._logger.debug("findOne()");

    return this._tagRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<Tag[]> {
    this._logger.debug("search()");

    return this._tagRepository.find({
      where: [{ name: ILike(`%${value}%`) }],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const tag: Tag = await this._tagRepository.findOne({
      where: { id },
      // relations: ["genera"],
    });

    if (!tag) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo referencias
    // TENGO QUE REVISAR QUE NO ESTE EN USO EN
    //  LINKS_TAGS
    //  POST_TAGS

    // if (tag.genera.length > 0) {
    //   this._logger.debug(ERROR_MESSAGE.OBJETO_REFERENCIADO);
    //   throw new NotFoundException(ERROR_MESSAGE.OBJETO_REFERENCIADO);
    // }

    // Soft Delete
    tag.deleted = true;
    tag.updatedAt = timestamp;
    tag.userMod = await this._userService.findOne(userId);
    await this._tagRepository.save(tag);

    // Hard Delete
    // await this._tagRepository.remove(tag);
  }
}
