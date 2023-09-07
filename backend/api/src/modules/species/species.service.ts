import {
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import * as moment from "moment";
import { validate } from "class-validator";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./species.dto";
import { Species } from "./species.entity";
import { GenusService } from "../genus/genus.service";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { UserService } from "modules/user/user.service";
import { ImageService } from "modules/image/image.service";
import { Image } from "modules/image/image.entity";
import { CreateImageDto } from "modules/image/image.dto";

const SPECIES_EXAMPLE_IMAGE_PATH = "species/example_images";
const SPECIES_GALLERY_IMAGE_PATH = "species/galleries_images";

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly _speciesRepository: Repository<Species>,
    private readonly _userService: UserService,
    private readonly _genusService: GenusService,
    private readonly _imageService: ImageService
  ) {}
  private readonly _logger = new Logger(SpeciesService.name);

  async create(
    createSpeciesDto: CreateSpeciesDto,
    userId: number
  ): Promise<Species> {
    this._logger.debug("create()");
    const {
      scientificName,
      commonName,
      englishName,
      description,
      genusId,
      organismType,
      status,
      foliageType,
      presence,
      exampleImg,
      galleryImg,
      links,
    } = createSpeciesDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Sólo voy a permitir que se repita la clave: name = "SIN DEFINIR"
    if (scientificName.toLowerCase() != "sin definir") {
      // Controlo que las claves no estén en uso
      const exists: Species = await this._speciesRepository.findOne({
        where: { scientificName: scientificName.toLowerCase(), deleted: false },
      });

      // Si existe y no esta borrado lógico entonces hay conflictos
      if (exists) {
        this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
        throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      }
    }

    // Si no existe entonces creo uno nuevo
    const species: Species = this._speciesRepository.create();
    species.scientificName = scientificName.toLowerCase();
    species.commonName = commonName ? commonName.toLowerCase() : null;
    species.englishName = englishName ? englishName.toLowerCase() : null;
    species.description = description ? description.toLowerCase() : null;
    species.genus = await this._genusService.findOne(genusId);
    species.organismType = organismType ? organismType : null;
    species.status = status ? status : null;
    species.foliageType = foliageType ? foliageType : null;
    species.presence = presence ? presence : null;
    species.createdAt = timestamp;
    species.updatedAt = timestamp;
    species.deleted = false;
    species.userMod = await this._userService.findOne(userId);

    // Guardo las imágenes recibidas
    if (exampleImg) {
      // Primero reviso imágenes existentes y si no coincide el hash debo eliminarlas
      const newImgUUID: string =
        `${exampleImg.size}_${exampleImg.mimetype}_${exampleImg.originalname}`.replace(
          "/",
          "_"
        );

      const newExampleImg: Image = await this._imageService.create(
        {
          uuid: newImgUUID,
          fileName: exampleImg.filename,
          originalPath: exampleImg.path,
          saveFolder: SPECIES_EXAMPLE_IMAGE_PATH,
          mimetype: exampleImg.mimetype,
          originalName: exampleImg.originalname,
        } as CreateImageDto,
        userId
      );
      species.exampleImg = newExampleImg;
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
            saveFolder: SPECIES_GALLERY_IMAGE_PATH,
            mimetype: imageReceived.mimetype,
            originalName: imageReceived.originalname,
          } as CreateImageDto,
          userId
        );
        newGallery.push(newImg);
      }
      species.galleryImg = newGallery;
    }

    // TODO: Falta enlazar los tags con TagsIDS

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
      englishName,
      description,
      genusId,
      organismType,
      status,
      foliageType,
      presence,
      exampleImg,
      galleryImg,
      links,
    } = updateSpeciesDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const species: Species = await this._speciesRepository.findOne({
      where: { id },
    });

    if (!species) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Sólo voy a permitir que se repita la clave: name = "SIN DEFINIR"
    if (scientificName.toLowerCase() != "sin definir") {
      // Controlo que las claves no estén en uso
      const exists: Species = await this._speciesRepository.findOne({
        where: {
          scientificName: scientificName.toLowerCase(),
          deleted: false,
          id: Not(id),
        },
      });

      // Si existe y no esta borrado lógico entonces hay conflictos
      if (exists) {
        this._logger.debug(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
        throw new ConflictException(ERROR_MESSAGE.CLAVE_PRIMARIA_EN_USO);
      }
    }

    species.scientificName = scientificName.toLowerCase();
    species.commonName = commonName ? commonName.toLowerCase() : null;
    species.englishName = englishName ? englishName.toLowerCase() : null;
    species.description = description ? description.toLowerCase() : null;
    species.genus = await this._genusService.findOne(genusId);
    species.organismType = organismType ? organismType : null;
    species.status = status ? status : null;
    species.foliageType = foliageType ? foliageType : null;
    species.presence = presence ? presence : null;
    species.updatedAt = timestamp;
    species.deleted = false;
    species.userMod = await this._userService.findOne(userId);

    // Actualizo las imágenes recibidas
    if (exampleImg) {
      // Primero reviso imágenes existentes y si no coincide el hash debo eliminarlas
      const newImgUUID: string =
        `${exampleImg.size}_${exampleImg.mimetype}_${exampleImg.originalname}`.replace(
          "/",
          "_"
        );
      if (species.exampleImg) {
        if (species.exampleImg.uuid !== newImgUUID) {
          // Tenía una imagen previa. Reemplazo
          await this._imageService.delete(species.exampleImg.id, userId);
          const newExampleImg: Image = await this._imageService.create(
            {
              uuid: newImgUUID,
              fileName: exampleImg.originalname,
              originalPath: exampleImg.path,
              saveFolder: SPECIES_EXAMPLE_IMAGE_PATH,
              mimetype: exampleImg.mimetype,
              originalName: exampleImg.originalname,
            } as CreateImageDto,
            userId
          );
          species.exampleImg = newExampleImg;
        }
        // Tenía una imagen previa pero es la misma.
      } else {
        // No tenía imagen previa. Creo nueva y guardo
        const newExampleImg: Image = await this._imageService.create(
          {
            uuid: newImgUUID,
            fileName: exampleImg.filename,
            originalPath: exampleImg.path,
            saveFolder: SPECIES_EXAMPLE_IMAGE_PATH,
            mimetype: exampleImg.mimetype,
            originalName: exampleImg.originalname,
          } as CreateImageDto,
          userId
        );
        species.exampleImg = newExampleImg;
      }
    } else {
      // Se quito la exampleImg y no se envió nada
      if (species.exampleImg) {
        await this._imageService.delete(species.exampleImg.id, userId);
        species.exampleImg = null;
      }
    }

    if (galleryImg && galleryImg.length > 0) {
      // Buscar todas las imagenes que ya se encuentran en la galeria.
      const gallery: Image[] = species.galleryImg;
      const newGallery: Image[] = [];
      const prevImagesUUIDS: string[] = gallery.map(
        (image: Image) => image.uuid
      );
      console.log({ gallery });
      const newImagesUUIDS: string[] = [];
      for (let i = 0; i < galleryImg.length; i++) {
        const imageReceived: Express.Multer.File = galleryImg[i];
        const newImgUUID: string =
          `${imageReceived.size}_${imageReceived.mimetype}_${imageReceived.originalname}`.replace(
            "/",
            "_"
          );
        newImagesUUIDS.push(newImgUUID);
        if (!(prevImagesUUIDS.indexOf(newImgUUID) > -1)) {
          // La imagen no se encuentra en la galeria
          const newImg: Image = await this._imageService.create(
            {
              uuid: newImgUUID,
              fileName: imageReceived.filename,
              originalPath: imageReceived.path,
              saveFolder: SPECIES_GALLERY_IMAGE_PATH,
              mimetype: imageReceived.mimetype,
              originalName: imageReceived.originalname,
            } as CreateImageDto,
            userId
          );
          newGallery.push(newImg);
        }
      }
      // Ahora tengo que quitar las imagenes que estan en la galeria gallery pero no vinieron con el dto
      // Son todas las imagenes uuid de la prevImagesUUIDS que no estan en newImagesUUIDS
      // Las tengo que eliminar de la relacion manyToMany y de la tabla imagenes (this._imageService.delete())
      const cleanGallery: Image[] = [];
      for (let i = 0; i < gallery.length; i++) {
        const image: Image = gallery[i];
        if (newImagesUUIDS.indexOf(image.uuid) > -1) {
          cleanGallery.push(image);
        } else {
          // Hay que eliminar aquellas huerfanas de galleria xD
          // La imagen ya no deberia estar en la galeria
          await this._imageService.delete(image.id, userId);
        }
      }
      species.galleryImg = [...cleanGallery, ...newGallery];
    }

    // TODO: Falta enlazar los tags con TagsIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(species);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._speciesRepository.save(species);
  }

  async findPaginated(
    options: IPaginationOptions & {
      orderBy?: string;
      orderDirection?: string;
      searchKey?: string;
    }
  ): Promise<Pagination<Species>> {
    this._logger.debug("findPaginated()");
    if (options.searchKey && options.searchKey !== "") {
      return paginate<Species>(this._speciesRepository, options, {
        where: [
          { deleted: false, scientificName: ILike(`%${options.searchKey}%`) },
          { deleted: false, commonName: ILike(`%${options.searchKey}%`) },
          { deleted: false, englishName: ILike(`%${options.searchKey}%`) },
          { deleted: false, description: ILike(`%${options.searchKey}%`) },
        ],
        order: { [options.orderBy]: options.orderDirection },
      });
    } else {
      return paginate<Species>(this._speciesRepository, options, {
        where: { deleted: false },
        order: { [options.orderBy]: options.orderDirection },
      });
    }
  }

  async findAll(): Promise<Species[]> {
    this._logger.debug("findAll()");

    return this._speciesRepository.find({
      where: { deleted: false },
      order: { scientificName: "ASC" },
    });
  }

  async findOne(id: number): Promise<Species> {
    this._logger.debug("findOne()");

    return this._speciesRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<Species[]> {
    this._logger.debug("search()");

    return this._speciesRepository.find({
      where: [
        { scientificName: ILike(`%${value}%`) },
        { commonName: ILike(`%${value}%`) },
        { englishName: ILike(`%${value}%`) },
        { description: ILike(`%${value}%`) },
      ],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const species: Species = await this._speciesRepository.findOne({
      where: { id },
      relations: ["specimens", "exampleImg"],
    });

    if (!species) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Controlo referencias
    if (species.specimens.length > 0) {
      this._logger.debug(ERROR_MESSAGE.OBJETO_REFERENCIADO);
      throw new NotFoundException(ERROR_MESSAGE.OBJETO_REFERENCIADO);
    }

    // Elimino los objetos relacionados (fuertemente dependientes)
    // DELETE species.exampleImg
    // DELETE species.galleryImg
    // DELETE species.links

    // Soft Delete
    species.deleted = true;
    species.updatedAt = timestamp;
    species.userMod = await this._userService.findOne(userId);
    await this._speciesRepository.save(species);

    // Hard Delete
    // await this._speciesRepository.remove(species);
  }
}
