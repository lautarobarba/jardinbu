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
import { CreateLinkDto, UpdateLinkDto } from "./link.dto";
import { Link } from "./link.entity";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { UserService } from "modules/user/user.service";

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly _linkRepository: Repository<Link>,
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(LinkService.name);

  async create(createLinkDto: CreateLinkDto, userId: number): Promise<Link> {
    this._logger.debug("create()");
    const { url, description, tagsIds } = createLinkDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Si no existe entonces creo uno nuevo
    const link: Link = this._linkRepository.create();
    link.url = url.toLowerCase();
    link.description = description ? description.toLowerCase() : null;
    link.createdAt = timestamp;
    link.updatedAt = timestamp;
    link.deleted = false;
    link.userMod = await this._userService.findOne(userId);

    // TODO: Falta enlazar los tags con TagsIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(link);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._linkRepository.save(link);
  }

  async update(updateLinkDto: UpdateLinkDto, userId: number): Promise<Link> {
    this._logger.debug("update()");
    const { id, url, description, tagsIds } = updateLinkDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const link: Link = await this._linkRepository.findOne({
      where: { id },
    });

    if (!link) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Si no hay problemas actualizo los atributos
    link.url = url.toLowerCase();
    link.description = description ? description.toLowerCase() : null;
    link.createdAt = timestamp;
    link.updatedAt = timestamp;
    link.deleted = false;
    link.userMod = await this._userService.findOne(userId);

    // TODO: Falta enlazar los tags con TagsIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(link);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._linkRepository.save(link);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<Link>> {
    this._logger.debug("findPaginated()");

    return paginate<Link>(this._linkRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<Link[]> {
    this._logger.debug("findAll()");

    return this._linkRepository.find({
      where: { deleted: false },
      order: { url: "ASC" },
    });
  }

  async findOne(id: number): Promise<Link> {
    this._logger.debug("findOne()");

    return this._linkRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<Link[]> {
    this._logger.debug("search()");

    return this._linkRepository.find({
      where: [
        { url: ILike(`%${value}%`) },
        { description: ILike(`%${value}%`) },
      ],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const link: Link = await this._linkRepository.findOne({
      where: { id },
      // relations: ["genera"],
    });

    if (!link) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo referencias
    // TENGO QUE REVISAR QUE NO ESTE EN USO EN
    //  POSTS_LINKS
    //  SPECIES_LINKS
    //  SPECIMENS_LINKS

    // if (tag.genera.length > 0) {
    //   this._logger.debug(ERROR_MESSAGE.OBJETO_REFERENCIADO);
    //   throw new NotFoundException(ERROR_MESSAGE.OBJETO_REFERENCIADO);
    // }

    // Soft Delete
    link.deleted = true;
    link.updatedAt = timestamp;
    link.userMod = await this._userService.findOne(userId);
    await this._linkRepository.save(link);

    // Hard Delete
    // await this._linkRepository.remove(link);
  }
}
