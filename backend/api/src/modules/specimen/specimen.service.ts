import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { validate } from "class-validator";
import { SpeciesService } from "modules/species/species.service";
import { ILike, Not, Repository } from "typeorm";
import { CreateSpecimenDto, UpdateSpecimenDto } from "./specimen.dto";
import { Specimen } from "./specimen.entity";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { Image } from "modules/image/image.entity";
import { ImageService } from "modules/image/image.service";
import { CreateImageDto } from "modules/image/image.dto";
import { UserService } from "modules/user/user.service";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";

const SPECIMENS_COVER_IMAGE_PATH = "specimens/cover_images";
const SPECIMENS_GALLERY_IMAGE_PATH = "specimens/galleries_images";

@Injectable()
export class SpecimenService {
  constructor(
    @InjectRepository(Specimen)
    private readonly _specimenRepository: Repository<Specimen>,
    private readonly _userService: UserService,
    private readonly _speciesService: SpeciesService,
    private readonly _imageService: ImageService
  ) {}
  private readonly _logger = new Logger(SpecimenService.name);

  async create(
    createSpecimenDto: CreateSpecimenDto,
    userId: number
  ): Promise<Specimen> {
    // TODO: falta guardar imagenes
    this._logger.debug("create()");
    const {
      code,
      description,
      speciesId,
      coordLat,
      coordLon,
      coverImg,
      galleryImg,
      linksIds,
    } = createSpecimenDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que el nuevo ejemplar no exista
    const exists: Specimen = await this._specimenRepository.findOne({
      where: { code: code.toLowerCase() },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists && !exists.deleted) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no existe entonces creo uno nuevo
    const specimen: Specimen = this._specimenRepository.create();
    specimen.code = code.toLowerCase();
    specimen.description = description ? description.toLowerCase() : null;
    specimen.species = await this._speciesService.findOne(speciesId);
    specimen.coordLat = coordLat ? coordLat.toLowerCase() : null;
    specimen.coordLon = coordLon ? coordLon.toLowerCase() : null;
    specimen.createdAt = timestamp;
    specimen.updatedAt = timestamp;
    specimen.deleted = false;
    specimen.userMod = await this._userService.findOne(userId);

    // Guardo las imágenes recibidas
    if (coverImg) {
      // Primero reviso imágenes existentes y si no coincide el hash debo eliminarlas
      const newImgUUID: string =
        `${coverImg.size}_${coverImg.mimetype}_${coverImg.originalname}`.replace(
          "/",
          "_"
        );

      const newExampleImg: Image = await this._imageService.create(
        {
          uuid: newImgUUID,
          fileName: coverImg.filename,
          originalPath: coverImg.path,
          saveFolder: SPECIMENS_COVER_IMAGE_PATH,
          mimetype: coverImg.mimetype,
          originalName: coverImg.originalname,
        } as CreateImageDto,
        userId
      );
      specimen.coverImg = newExampleImg;
    }

    if (galleryImg && galleryImg.length > 0) {
      // Buscar todas las imagenes que ya se encuentran en la galeria.
      const newGallery: Image[] = [];
      for (let i = 0; i < galleryImg.length; i++) {
        const imageReceived: Express.Multer.File = galleryImg[i];
        const newImgUUID: string =
          `${imageReceived.size}_${imageReceived.mimetype}_${imageReceived.originalname}`.replace(
            "/",
            "_"
          );

        const newImg: Image = await this._imageService.create(
          {
            uuid: newImgUUID,
            fileName: imageReceived.filename,
            originalPath: imageReceived.path,
            saveFolder: SPECIMENS_GALLERY_IMAGE_PATH,
            mimetype: imageReceived.mimetype,
            originalName: imageReceived.originalname,
          } as CreateImageDto,
          userId
        );
        newGallery.push(newImg);
      }
      specimen.galleryImg = newGallery;
    }

    // TODO: Falta enlazar los links con LinksIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(specimen);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._specimenRepository.save(specimen);
  }

  async update(
    updateSpecimenDto: UpdateSpecimenDto,
    userId: number
  ): Promise<Specimen> {
    this._logger.debug("update()");
    const {
      id,
      code,
      description,
      speciesId,
      coordLat,
      coordLon,
      coverImg,
      galleryImg,
      linksIds,
    } = updateSpecimenDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const specimen: Specimen = await this._specimenRepository.findOne({
      where: { id },
    });

    if (!specimen) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo que la clave no esté en uso
    const exists: Specimen = await this._specimenRepository.findOne({
      where: { code: code.toLowerCase(), deleted: false, id: Not(id) },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists) {
      this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
    }

    // Si no hay problemas actualizo los atributos
    specimen.code = code.toLowerCase();
    specimen.description = description ? description.toLowerCase() : null;
    specimen.species = await this._speciesService.findOne(speciesId);
    specimen.coordLat = coordLat ? coordLat.toLowerCase() : null;
    specimen.coordLon = coordLon ? coordLon.toLowerCase() : null;
    specimen.updatedAt = timestamp;
    specimen.deleted = false;
    specimen.userMod = await this._userService.findOne(userId);

    // TODO: Falta enlazar LAS IMAGENES (BUSCAR EN ESPECIES UPDATE)

    // TODO: Falta enlazar los links con LinksIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(specimen);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._specimenRepository.save(specimen);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<Specimen>> {
    this._logger.debug("findPaginated()");

    return paginate<Specimen>(this._specimenRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<Specimen[]> {
    this._logger.debug("findAll()");

    return this._specimenRepository.find({
      where: { deleted: false },
      order: { code: "ASC" },
    });
  }

  async findOne(id: number): Promise<Specimen> {
    this._logger.debug("findOne()");

    return this._specimenRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<Specimen[]> {
    this._logger.debug("search()");

    return this._specimenRepository.find({
      where: [
        { code: ILike(`%${value}%`) },
        { description: ILike(`%${value}%`) },
      ],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const specimen: Specimen = await this._specimenRepository.findOne({
      where: { id },
      // relations: ["genera"],
    });

    if (!specimen) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Elimino los objetos relacionados (fuertemente dependientes)
    // DELETE specimen.coverImg
    // DELETE specimen.galleryImg
    // DELETE specimen.links

    // Soft Delete
    specimen.deleted = true;
    specimen.updatedAt = timestamp;
    specimen.userMod = await this._userService.findOne(userId);
    await this._specimenRepository.save(specimen);

    // Hard Delete
    // await this._specimenRepository.remove(specimen);
  }
}
