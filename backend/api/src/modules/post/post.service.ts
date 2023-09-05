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
import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { Post } from "./post.entity";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { UserService } from "modules/user/user.service";
import { ImageService } from "modules/image/image.service";
import { Image } from "modules/image/image.entity";
import { CreateImageDto } from "modules/image/image.dto";

const POSTS_COVER_IMAGE_PATH = "posts/cover_images";
const POSTS_GALLERY_IMAGE_PATH = "posts/galleries_images";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly _postRepository: Repository<Post>,
    private readonly _userService: UserService,
    private readonly _imageService: ImageService
  ) {}
  private readonly _logger = new Logger(PostService.name);

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    this._logger.debug("create()");
    const {
      spanishTitle,
      englishTitle,
      coverImg,
      spanishContent,
      englishContent,
      tagsIds,
      galleryImg,
      linksIds,
    } = createPostDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Si no existe entonces creo uno nuevo
    const post: Post = this._postRepository.create();
    post.spanishTitle = spanishTitle ? spanishTitle : null;
    post.englishTitle = englishTitle ? englishTitle : null;
    post.spanishContent = spanishContent ? spanishContent : null;
    post.englishContent = englishContent ? englishContent : null;
    post.createdAt = timestamp;
    post.updatedAt = timestamp;
    post.deleted = false;
    post.userMod = await this._userService.findOne(userId);

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
          saveFolder: POSTS_COVER_IMAGE_PATH,
          mimetype: coverImg.mimetype,
          originalName: coverImg.originalname,
        } as CreateImageDto,
        userId
      );
      post.coverImg = newExampleImg;
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
            saveFolder: POSTS_GALLERY_IMAGE_PATH,
            mimetype: imageReceived.mimetype,
            originalName: imageReceived.originalname,
          } as CreateImageDto,
          userId
        );
        newGallery.push(newImg);
      }
      post.galleryImg = newGallery;
    }

    // TODO: Falta enlazar los tags con TagsIDS
    // TODO: Falta enlazar los links con LinksIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(post);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._postRepository.save(post);
  }

  async update(updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    this._logger.debug("update()");
    const {
      id,
      spanishTitle,
      englishTitle,
      coverImg,
      spanishContent,
      englishContent,
      tagsIds,
      galleryImg,
      linksIds,
    } = updatePostDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const post: Post = await this._postRepository.findOne({
      where: { id },
    });

    if (!post) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Si no hay problemas actualizo los atributos
    post.spanishTitle = spanishTitle ? spanishTitle : null;
    post.englishTitle = englishTitle ? englishTitle : null;
    post.spanishContent = spanishContent ? spanishContent : null;
    post.englishContent = englishContent ? englishContent : null;
    post.updatedAt = timestamp;
    post.deleted = false;
    post.userMod = await this._userService.findOne(userId);

    // TODO: Falta enlazar LAS IMAGENES (BUSCAR EN ESPECIES UPDATE)

    // TODO: Falta enlazar los tags con TagsIDS
    // TODO: Falta enlazar los links con LinksIDS

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(post);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._postRepository.save(post);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<Post>> {
    this._logger.debug("findPaginated()");

    return paginate<Post>(this._postRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<Post[]> {
    this._logger.debug("findAll()");

    return this._postRepository.find({
      where: { deleted: false },
      order: { spanishTitle: "ASC" },
    });
  }

  async findOne(id: number): Promise<Post> {
    this._logger.debug("findOne()");

    return this._postRepository.findOne({
      where: { id },
    });
  }

  async search(value: string): Promise<Post[]> {
    this._logger.debug("search()");

    return this._postRepository.find({
      where: [
        { spanishTitle: ILike(`%${value}%`) },
        { englishTitle: ILike(`%${value}%`) },
        { spanishContent: ILike(`%${value}%`) },
        { englishContent: ILike(`%${value}%`) },
      ],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const post: Post = await this._postRepository.findOne({
      where: { id },
      // relations: ["genera"],
    });

    if (!post) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    // Elimino los objetos relacionados (fuertemente dependientes)
    // DELETE post.coverImg
    // DELETE post.galleryImg
    // DELETE post.tags
    // DELETE post.links

    // Soft Delete
    post.deleted = true;
    post.updatedAt = timestamp;
    post.userMod = await this._userService.findOne(userId);
    await this._postRepository.save(post);

    // Hard Delete
    // await this._postRepository.remove(post);
  }
}
