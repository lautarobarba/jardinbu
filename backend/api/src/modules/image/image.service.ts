import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "modules/user/user.service";
import { Repository } from "typeorm";
import { CreateImageDto, UpdateNoteDto } from "./image.dto";
import { Image } from "./image.entity";
import * as moment from "moment";
import * as mv from "mv";
import * as fs from "fs";
import { validate } from "class-validator";

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly _imageRepository: Repository<Image>,
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(ImageService.name);

  async create(createImageDto: CreateImageDto, userId: number): Promise<Image> {
    this._logger.debug("create()");
    const { uuid, fileName, originalPath, saveFolder, mimetype, originalName } =
      createImageDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // 1° Voy a mover la imagen desde la carpeta temporal donde la recibí
    const imgSource = originalPath;
    const imgDestination = imgSource.replace("temp", saveFolder);
    mv(imgSource, imgDestination, { mkdirp: true }, (err: Error) => {
      console.log(err);
    });

    // 2° La guardo en la DB
    const image: Image = this._imageRepository.create();
    image.uuid = uuid;
    image.fileName = fileName;
    image.path = imgDestination;
    image.mimetype = mimetype;
    image.originalName = originalName;
    image.createdAt = timestamp;
    image.updatedAt = timestamp;
    image.deleted = false;
    image.userMod = await this._userService.findOne(userId);

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(image);
    if (errors && errors.length > 0) {
      this._logger.debug("NotAcceptableException()");
      throw new NotAcceptableException();
    }

    return this._imageRepository.save(image);
  }

  // async findAll(): Promise<Note[]> {
  //   this._logger.debug("findAll()");
  //   return this._noteRepository.find({
  //     where: { deleted: false },
  //     order: { id: "ASC" },
  //     relations: ["user"],
  //   });
  // }

  async findOne(id: number): Promise<Image> {
    this._logger.debug("findOne()");
    return this._imageRepository.findOne({
      where: { id },
      relations: ["userMod"],
    });
  }

  async findOneById(id: number): Promise<Image> {
    this._logger.debug("findOnById()");
    return this._imageRepository.findOne({
      where: { id },
      relations: ["userMod"],
    });
  }

  async findOneByUUID(uuid: string): Promise<Image> {
    this._logger.debug("findOnByUUID()");
    return this._imageRepository.findOne({
      where: { uuid },
      relations: ["userMod"],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const image: Image = await this._imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      this._logger.debug("NotFoundException");
      throw new NotFoundException();
    }

    // Soft Delete
    image.deleted = true;
    image.updatedAt = timestamp;
    image.userMod = await this._userService.findOne(userId);
    await this._imageRepository.save(image);

    // Hard Delete
    // await this._imageRepository.remove(image);
  }

  async deleteUselessImages() {
    this._logger.debug("deleteUselessImages()");
    const images: Image[] = await this._imageRepository.find({
      where: { deleted: true, fileDeleted: false },
    });

    images.forEach(async (image: Image) => {
      const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");
      fs.unlink(image.path, (err: Error) => {
        if (err) console.log(err);
      });
      image.fileDeleted = true;
      image.updatedAt = timestamp;
      await this._imageRepository.save(image);
    });
  }
}
