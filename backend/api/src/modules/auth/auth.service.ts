import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, UpdateUserDto } from "modules/user/user.dto";
import { UserService } from "modules/user/user.service";
import { User } from "../user/user.entity";
import {
  ChangePasswordDto,
  LoginDto,
  RecoverPasswordDto,
  SessionDto,
} from "./auth.dto";
import { MailerService } from "../mailer/mailer.service";
import { Role } from "../auth/role.enum";
import { ERROR_MESSAGE } from "modules/utils/error-message";

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _mailerService: MailerService
  ) {}
  private readonly _logger = new Logger(AuthService.name);

  async register(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    createUserDto: CreateUserDto
  ): Promise<string> {
    this._logger.debug("register()");

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword: string = await hash(createUserDto.password, salt);

    // Creo el usuario
    const user: User = await this._userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // const tokens: SessionDto = await this.getTokens(user.id, user.email);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    const tokenPayload: TokenPayload = { userId: user.id };
    const token: string = this._jwtService.sign(tokenPayload);

    // Envío correo de registro a su email
    await this._mailerService.sendRegistrationEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user.email,
      token
    );

    return token;
  }

  async login(loginDto: LoginDto): Promise<string> {
    this._logger.debug("login()");
    const { email, password } = loginDto;
    const user: User = await this._userService.findOneByEmail(email);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    } else {
      console.log({ user });
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      this._logger.debug(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
      throw new UnauthorizedException(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
    }

    // const tokens: SessionDto = await this.getTokens(user.id, user.email);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    const tokenPayload: TokenPayload = { userId: user.id };
    const token: string = this._jwtService.sign(tokenPayload);

    return token;
  }

  async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    this._logger.debug("getAuthenticatedUser()");
    try {
      const user = await this._userService.findOneByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      this._logger.debug(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
      throw new UnauthorizedException(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      this._logger.debug(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
      throw new UnauthorizedException(ERROR_MESSAGE.CONTRASENA_INCORRECTA);
    }
  }

  // async refreshTokens(id: number, refreshToken: string) {
  // 	this._logger.debug('refreshTokens()');
  // 	const user = await this._userService.findOne(id);

  // 	if (!user || !user.refreshToken) {
  // 		this._logger.debug('Error: Access Denied');
  // 		throw new ForbiddenException('Error: Access Denied');
  // 	}

  // 	if (refreshToken !== user.refreshToken) {
  // 		this._logger.debug('Error: Wrong token');
  // 		throw new ForbiddenException('Error: Wrong token');
  // 	}

  // 	const tokens: SessionDto = await this.getTokens(user.id, user.email);
  // 	await this.updateRefreshToken(user.id, tokens.refreshToken);

  // 	return tokens;
  // }

  async logout(user: User) {
    this._logger.debug("logout()");
    return this._userService.logout(user);
  }

  // async testPrivateRoute(id: number): Promise<string> {
  // 	this._logger.debug('testPrivateRoute()');
  // 	const user: User = await this._userService.findOne(id);
  // 	return `Este sitio sólo se puede ver si el usuario está autenticado.\nUSER_ID: ${user.id}\nROLE: ${user.role}\nFIRST_NAME: ${user.firstname}\nLAST_NAME: ${user.lastname}\nEMAIL: ${user.email}`;
  // }

  // async testEmailConfirmed(id: number): Promise<string> {
  // 	this._logger.debug('testEmailConfirmed()');
  // 	const user: User = await this._userService.findOne(id);
  // 	return `Este sitio sólo se puede ver si el usuario está autenticado y tiene el correo electrónico confirmado.\nUSER_ID: ${user.id}\nROLE: ${user.role}\nFIRST_NAME: ${user.firstname}\nLAST_NAME: ${user.lastname}\nEMAIL: ${user.email}`;
  // }

  // async testRolePermission(id: number): Promise<string> {
  // 	this._logger.debug('testRolePermission()');
  // 	const user: User = await this._userService.findOne(id);
  // 	return `Este sitio sólo se puede ver si el usuario está autenticado, tiene el correo electrónico confirmado y tiene rol de ${Role.ADMIN}.\nUSER_ID: ${user.id}\nROLE: ${user.role}\nFIRST_NAME: ${user.firstname}\nLAST_NAME: ${user.lastname}\nEMAIL: ${user.email}`;
  // }

  //   async updateRefreshToken(id: number, refreshToken: string) {
  //     this._logger.debug("updateRefreshToken()");
  //     // Hash token
  //     const salt = await genSalt(10);
  //     const hashedRefreshToken: string = await hash(refreshToken, salt);
  //     await this._userService.updateRefreshToken(id, refreshToken);
  //   }

  //   async getTokens(id: number, email: string): Promise<SessionDto> {
  //     this._logger.debug("getTokens()");
  //     const [accessToken, refreshToken] = await Promise.all([
  //       this._jwtService.signAsync(
  //         {
  //           sub: id,
  //           email,
  //         },
  //         {
  //           secret: ENV_VAR.JWT_SECRET,
  //           expiresIn: ENV_VAR.JWT_EXPIRATION_TIME,
  //         }
  //       ),
  //       this._jwtService.signAsync(
  //         {
  //           sub: id,
  //           email,
  //         },
  //         {
  //           secret: ENV_VAR.JWT_SECRET,
  //           expiresIn: ENV_VAR.JWT_REFRESH_EXPIRATION_TIME,
  //         }
  //       ),
  //     ]);

  //     const tokens: SessionDto = {
  //       accessToken,
  //       refreshToken,
  //     };

  //     return tokens;
  //   }

  async sendEmailConfirmationEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    user: User
  ) {
    this._logger.debug("sendEmailConfirmationEmail()");
    const tokenPayload: TokenPayload = { userId: user.id };
    const token: string = this._jwtService.sign(tokenPayload);

    await this._mailerService.sendEmailConfirmationEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user.email,
      token
    );
  }

  async confirmEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    user: User
  ) {
    this._logger.debug("confirmEmail()");
    // Reviso si el usuario ya tenia el correo confirmado
    if (user.isEmailConfirmed) {
      this._logger.debug(ERROR_MESSAGE.EMAIL_YA_CONFIRMADO);
      throw new BadRequestException(ERROR_MESSAGE.EMAIL_YA_CONFIRMADO);
    }

    const updateUserDto: UpdateUserDto = new UpdateUserDto();
    const { id, email, firstname, lastname, status, role } = user;
    updateUserDto.id = id;
    updateUserDto.email = email;
    updateUserDto.firstname = firstname;
    updateUserDto.lastname = lastname;
    updateUserDto.status = status;
    updateUserDto.role = role;
    updateUserDto.isEmailConfirmed = true;

    await this._userService.update(updateUserDto);

    await this._mailerService.sendEmailConfirmedEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user.email
    );
  }

  async sendRecoverPasswordEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    user: User
  ) {
    this._logger.debug("sendRecoverPasswordEmail()");
    const tokenPayload: TokenPayload = { userId: user.id };
    const token: string = this._jwtService.sign(tokenPayload);

    await this._mailerService.sendRecoverPasswordEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user.email,
      token
    );
  }

  async changePassword(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    user: User,
    newPassword: string
  ) {
    this._logger.debug("changePassword()");

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword: string = await hash(newPassword, salt);

    await this._userService.updatePassword(user, hashedPassword);

    await this._mailerService.sendPasswordChangedEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user.email
    );
  }
}
