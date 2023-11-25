import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SpecimenService } from "modules/specimen/specimen.service";
import { ILike, Not, Repository } from "typeorm";
import { CreateQRCodeDto, UpdateQRCodeDto } from "./qr-code.dto";
import { QRCode } from "./qr-code.entity";
import * as moment from "moment";
import { validate } from "class-validator";
import { UserService } from "modules/user/user.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { v4 as uuidv4 } from "uuid";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";

@Injectable()
export class QRCodeService {
  constructor(
    @InjectRepository(QRCode)
    private readonly _qRCodeRepository: Repository<QRCode>,
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(QRCodeService.name);

  async create(
    createQRCodeDto: CreateQRCodeDto,
    userId: number
  ): Promise<QRCode> {
    this._logger.debug("create()");
    const { title, link } = createQRCodeDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que las claves no estén en uso
    const exists: QRCode = await this._qRCodeRepository.findOne({
      where: { title: title.toLowerCase(), deleted: false },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const qRCode: QRCode = this._qRCodeRepository.create();
    qRCode.title = title.toLowerCase();
    qRCode.uuid = uuidv4();
    qRCode.link = link.toLowerCase();
    qRCode.createdAt = timestamp;
    qRCode.updatedAt = timestamp;
    qRCode.deleted = false;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(qRCode);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._qRCodeRepository.save(qRCode);
  }

  async update(
    updateQRCodeDto: UpdateQRCodeDto,
    userId: number
  ): Promise<QRCode> {
    this._logger.debug("update()");
    const { id, title, link } = updateQRCodeDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const qRCode: QRCode = await this._qRCodeRepository.findOne({
      where: { id },
    });

    if (!qRCode) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo que las claves no estén en uso
    const exists: QRCode = await this._qRCodeRepository.findOne({
      where: { title: title.toLowerCase(), deleted: false, id: Not(id) },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no hay problemas actualizo los atributos
    qRCode.title = title.toLowerCase();
    qRCode.link = link.toLowerCase();
    qRCode.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(qRCode);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._qRCodeRepository.save(qRCode);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<QRCode>> {
    this._logger.debug("findPaginated()");

    return paginate<QRCode>(this._qRCodeRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<QRCode[]> {
    this._logger.debug("findAll()");

    return this._qRCodeRepository.find({
      where: { deleted: false },
      order: { title: "ASC" },
    });
  }

  async findOne(id: number): Promise<QRCode> {
    this._logger.debug("findOne()");

    return this._qRCodeRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<QRCode[]> {
    this._logger.debug("search()");

    return this._qRCodeRepository.find({
      where: [{ title: ILike(`%${value}%`) }, { link: ILike(`%${value}%`) }],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const qRCode: QRCode = await this._qRCodeRepository.findOne({
      where: { id },
    });

    if (!qRCode) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Soft Delete
    qRCode.deleted = true;
    qRCode.updatedAt = timestamp;
    await this._qRCodeRepository.save(qRCode);

    // Hard Delete
    // await this._qRCodeRepository.remove(qRCode);
  }
}
