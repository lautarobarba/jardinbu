import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { Status, User } from "./user.entity";
import * as moment from "moment";
import { validate } from "class-validator";
import { Role } from "../auth/role.enum";
import { ERROR_MESSAGE } from "modules/utils/error-message";
import { ImageService } from "modules/image/image.service";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { Image } from "modules/image/image.entity";
import { CreateImageDto } from "modules/image/image.dto";

const USER_PROFILE_IMAGE_PATH = "users/profile_images";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @Inject(forwardRef(() => ImageService))
    private readonly _imageService: ImageService
  ) {}
  private readonly _logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<User> {
    this._logger.debug("create()");
    const { email, firstname, lastname, password } = createUserDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    // Controlo que el nuevo usuario no exista
    const exists: User = await this._userRepository.findOne({
      where: { email },
    });

    // Si existe y no esta borrado lógico entonces hay conflictos
    if (exists && !exists.deleted) {
      this._logger.debug(ERROR_MESSAGE.EMAIL_EN_USO);
      throw new ConflictException(ERROR_MESSAGE.EMAIL_EN_USO);
    }

    // Si existe pero estaba borrado lógico entonces lo recupero
    if (exists && exists.deleted) {
      exists.isEmailConfirmed = false;
      exists.firstname = firstname.toLowerCase();
      exists.lastname = lastname.toLowerCase();
      exists.password = password;
      exists.status = Status.ACTIVE;
      exists.role = Role.USER;
      exists.updatedAt = timestamp;
      exists.deleted = false;

      // Controlo que el modelo no tenga errores antes de guardar
      const errors = await validate(exists);
      if (errors && errors.length > 0) {
        this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
        throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
      }

      return this._userRepository.save(exists);
    }

    // Si no existe entonces creo uno nuevo
    const user: User = this._userRepository.create();
    user.email = email.toLowerCase();
    user.isEmailConfirmed = false;
    user.firstname = firstname.toLowerCase();
    user.lastname = lastname.toLowerCase();
    user.password = password;
    user.status = Status.ACTIVE;
    user.role = Role.USER;
    user.createdAt = timestamp;
    user.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(user);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._userRepository.save(user);
  }

  async update(updateUserDto: UpdateUserDto, userId: number): Promise<User> {
    this._logger.debug("update()");
    const {
      id,
      isEmailConfirmed,
      firstname,
      lastname,
      profilePicture,
      status,
      role,
    } = updateUserDto;
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const user: User = await this._userRepository.findOne({
      where: { id },
    });

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    user.isEmailConfirmed = isEmailConfirmed ? isEmailConfirmed : false;
    user.firstname = firstname ? firstname.toLowerCase() : null;
    user.lastname = lastname ? lastname.toLowerCase() : null;
    user.status = status ? status : Status.ACTIVE;
    user.role = role ? role : Role.USER;
    user.updatedAt = timestamp;
    user.deleted = false;
    user.userMod = await this.findOneById(userId);

    // Actualizo las imágenes recibidas
    if (profilePicture) {
      // Primero reviso imágenes existentes y si no coincide el hash debo eliminarlas
      const newImgUUID: string =
        `${profilePicture.size}_${profilePicture.mimetype}_${profilePicture.originalname}`.replace(
          "/",
          "_"
        );
      if (user.profilePicture) {
        if (user.profilePicture.uuid !== newImgUUID) {
          // Tenía una imagen previa. Reemplazo
          await this._imageService.delete(user.profilePicture.id, userId);
          const newProfilePicture: Image = await this._imageService.create(
            {
              uuid: newImgUUID,
              fileName: profilePicture.originalname,
              originalPath: profilePicture.path,
              saveFolder: USER_PROFILE_IMAGE_PATH,
              mimetype: profilePicture.mimetype,
              originalName: profilePicture.originalname,
            } as CreateImageDto,
            userId
          );
          user.profilePicture = newProfilePicture;
        }
        // Tenía una imagen previa pero es la misma.
      } else {
        // No tenía imagen previa. Creo nueva y guardo
        const newProfilePicture: Image = await this._imageService.create(
          {
            uuid: newImgUUID,
            fileName: profilePicture.filename,
            originalPath: profilePicture.path,
            saveFolder: USER_PROFILE_IMAGE_PATH,
            mimetype: profilePicture.mimetype,
            originalName: profilePicture.originalname,
          } as CreateImageDto,
          userId
        );
        user.profilePicture = newProfilePicture;
      }
    } else {
      // Se quito la profilePicture y no se envió nada
      if (user.profilePicture) {
        await this._imageService.delete(user.profilePicture.id, userId);
        user.profilePicture = null;
      }
    }

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(user);
    if (errors && errors.length > 0) {
      this._logger.debug(ERROR_MESSAGE.NO_ACEPTABLE);
      throw new NotAcceptableException(ERROR_MESSAGE.NO_ACEPTABLE);
    }

    return this._userRepository.save(user);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    this._logger.debug("updateRefreshToken()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const user: User = await this._userRepository.findOne({
      where: { id },
    });

    if (!user) {
      this._logger.debug("Error: Not Found");
      throw new NotFoundException("Error: Not Found");
    }

    user.refreshToken = refreshToken;
    user.updatedAt = timestamp;

    // Controlo que el modelo no tenga errores antes de guardar
    const errors = await validate(user);
    if (errors && errors.length > 0) {
      this._logger.debug("Error: Not Acceptable");
      throw new NotAcceptableException("Error: Not Acceptable");
    }

    return this._userRepository.save(user);
  }

  async updatePassword(user: User, password: string) {
    this._logger.debug("updatePassword()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    user.password = password;
    user.updatedAt = timestamp;

    return this._userRepository.save(user);
  }

  async findPaginated(
    options: IPaginationOptions & { orderBy?: string; orderDirection?: string }
  ): Promise<Pagination<User>> {
    this._logger.debug("findPaginated()");

    return paginate<User>(this._userRepository, options, {
      where: { deleted: false },
      order: { [options.orderBy]: options.orderDirection },
    });
  }

  async findAll(): Promise<User[]> {
    this._logger.debug("findAll()");

    return this._userRepository.find({
      where: { deleted: false },
      order: { lastname: "ASC" },
    });
  }

  async findOne(id: number): Promise<User> {
    this._logger.debug("findOne()");

    return this._userRepository.findOne({
      where: { id },
    });
  }

  async findOneById(id: number): Promise<User> {
    this._logger.debug("findOneById()");

    return this._userRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    this._logger.debug("findOneByEmail()");

    return this._userRepository.findOne({
      where: { email },
    });
  }

  async search(value: string): Promise<User[]> {
    this._logger.debug("search()");

    return this._userRepository.find({
      where: [
        { email: ILike(`%${value}%`) },
        { firstname: ILike(`%${value}%`) },
        { lastname: ILike(`%${value}%`) },
      ],
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    this._logger.debug("delete()");
    const timestamp: any = moment().format("YYYY-MM-DD HH:mm:ss");

    const user: User = await this._userRepository.findOne({
      where: { id },
    });

    // Controlo referencias
    // TENGO QUE REVISAR QUE NO ESTE EN USO EN NINGUNA ENTIDAD
    //  LINKS_TAGS
    //  POST_TAGS

    // Soft Delete
    user.deleted = true;
    user.updatedAt = timestamp;
    user.userMod = await this.findOne(userId);
    await this._userRepository.save(user);

    // Hard Delete
    // await this._userRepository.remove(user);
  }

  async logout(user: User): Promise<void> {
    user.refreshToken = null;
    this._userRepository.save(user);
  }

  async getUserFromRequest(request: Request): Promise<User> {
    this._logger.debug("getUserFromRequest()");
    const userOnRequest: User = request.user as User;
    const user: User = await this._userRepository.findOne({
      where: { id: userOnRequest.id },
    });

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    return user;
  }
}
