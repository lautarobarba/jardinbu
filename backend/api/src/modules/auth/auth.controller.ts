import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Response, Request } from "express";
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { CreateUserDto } from "modules/user/user.dto";
import { User } from "modules/user/user.entity";
import { UserService } from "modules/user/user.service";
import {
  ChangePasswordDto,
  LoginDto,
  RecoverPasswordDto,
  SessionDto,
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { JwtAuthenticationGuard } from "./guards/jwt-authentication.guard";
// import { IJWTPayload } from "./token-payload.interface";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { IsEmailConfirmedGuard } from "./guards/is-email-confirmed.guard";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "../auth/role.enum";
import { LocalFilesInterceptor } from "modules/utils/localFiles.interceptor";
import { ERROR_MESSAGE } from "modules/utils/error-message";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(AuthController.name);

  //   @Post("register")
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiResponse({
  //     status: HttpStatus.CREATED,
  //     type: SessionDto,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.CONFLICT,
  //     description: "Error: Email already in use",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_ACCEPTABLE,
  //     description: "Error: Not Acceptable",
  //   })
  //   async register(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response,
  //     @Body() createUserDto: CreateUserDto
  //   ): Promise<SessionDto> {
  //     this._logger.debug("POST: /api/auth/register");
  //     // Urls que necesito para los correos
  //     const ulrToImportCssInEmail: string = `${request.protocol}://host.docker.internal:${process.env.BACK_PORT}`;
  //     const ulrToImportImagesInEmail: string = `${
  //       request.protocol
  //     }://${request.get("Host")}`;

  //     response.status(HttpStatus.CREATED);
  //     return this._authService.register(
  //       ulrToImportCssInEmail,
  //       ulrToImportImagesInEmail,
  //       createUserDto
  //     );
  //   }

  @Post("login")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sesión iniciada correctamente",
    type: SessionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGE.NO_ENCONTRADO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGE.CONTRASENA_INCORRECTA,
  })
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto
  ): Promise<SessionDto> {
    this._logger.debug("POST: /api/auth/login");
    response.status(HttpStatus.OK);
    const token = await this._authService.login(loginDto);
    console.log({ token });

    const cookie: string = `accessToken=${token}; HttpOnly; Path=/; Max-Age=${
      process.env.JWT_EXPIRATION_TIME ?? "1d"
    }`;
    response.setHeader("Set-Cookie", cookie);

    return { accessToken: token };
  }

  @Get("me")
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Error: Not Found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Error: Unauthorized",
  })
  async getAuthUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<User> {
    this._logger.debug("GET: /api/auth/me");
    const user: User = await this._userService.getUserFromRequest(request);
    response.status(HttpStatus.OK);
    return this._authService.getAuthUser(user);
  }

  //   @Post("logout")
  //   @UseGuards(JwtAuthenticationGuard)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   async logout(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ) {
  //     this._logger.debug("POST: /api/auth/logout");
  //     const session: IJWTPayload = request.user as IJWTPayload;
  //     const user: User = await this._userService.findOne(session.sub);
  //     response.status(HttpStatus.OK);
  //     await this._authService.logout(user.id);
  //   }

  //   @Post("refresh")
  //   @UseGuards(RefreshTokenGuard)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     type: SessionDto,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.FORBIDDEN,
  //     description: "Error: Access Denied/Error: Wrong token",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_ACCEPTABLE,
  //     description: "Error: Not Acceptable",
  //   })
  //   async refreshTokens(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ): Promise<SessionDto> {
  //     this._logger.debug("POST: /api/auth/refresh");
  //     const { payload, refreshToken } = request.user as {
  //       payload: IJWTPayload;
  //       refreshToken: string;
  //     };
  //     const userId: number = Number(payload.sub);

  //     response.status(HttpStatus.OK);
  //     return this._authService.refreshTokens(userId, refreshToken);
  //   }

  //   @Post("change-password")
  //   @UseGuards(JwtAuthenticationGuard)
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     type: SessionDto,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized/Error: Not allow",
  //   })
  //   async changePassword(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response,
  //     @Body() changePasswordDto: ChangePasswordDto
  //   ): Promise<SessionDto> {
  //     this._logger.debug("POST: /api/auth/change-password");
  //     // Sólo administradores y propietarios pueden actualizar contraseñas
  //     const user: User = await this._userService.getUserFromRequest(request);

  //     if (user.role !== Role.ADMIN && user.id != changePasswordDto.id) {
  //       this._logger.debug("Error: Not allow");
  //       throw new UnauthorizedException("Error: Not allow");
  //     }

  //     response.status(HttpStatus.OK);
  //     return this._authService.changePassword(changePasswordDto);
  //   }

  //   @Post("email-recover-password")
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found/Error: Account does not exists",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   async recoverPassword(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response,
  //     @Body() recoverPasswordDto: RecoverPasswordDto
  //   ) {
  //     this._logger.debug("POST: /api/auth/recover-password");
  //     // Urls que necesito para los correos
  //     const ulrToImportCssInEmail: string = `${request.protocol}://host.docker.internal:${process.env.BACK_PORT}`;
  //     const ulrToImportImagesInEmail: string = `${
  //       request.protocol
  //     }://${request.get("Host")}`;

  //     response.status(HttpStatus.OK);
  //     return this._authService.recoverPassword(
  //       ulrToImportCssInEmail,
  //       ulrToImportImagesInEmail,
  //       recoverPasswordDto
  //     );
  //   }

  //   @Post("email-confirmation/send")
  //   @UseGuards(JwtAuthenticationGuard)
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   async sendEmailConfirmationEmail(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ) {
  //     this._logger.debug("POST: /api/auth/email-confirmation/send");
  //     const ulrToImportCssInEmail: string = `${request.protocol}://host.docker.internal:${process.env.BACK_PORT}`;
  //     const ulrToImportImagesInEmail: string = `${
  //       request.protocol
  //     }://${request.get("Host")}`;

  //     const user: User = await this._userService.getUserFromRequest(request);

  //     response.status(HttpStatus.OK);
  //     return this._authService.sendEmailConfirmationEmail(
  //       ulrToImportCssInEmail,
  //       ulrToImportImagesInEmail,
  //       user
  //     );
  //   }

  //   @Post("email-confirmation/confirm")
  //   @UseGuards(JwtAuthenticationGuard)
  //   @UseInterceptors(ClassSerializerInterceptor)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: "Error: Not Found",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.BAD_REQUEST,
  //     description: "Error: Email already confirmed",
  //   })
  //   async confirmEmail(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ) {
  //     this._logger.debug("POST: /api/auth/email-confirmation/confirm");
  //     const ulrToImportCssInEmail: string = `${request.protocol}://host.docker.internal:${process.env.BACK_PORT}`;
  //     const ulrToImportImagesInEmail: string = `${
  //       request.protocol
  //     }://${request.get("Host")}`;

  //     const user: User = await this._userService.getUserFromRequest(request);

  //     response.status(HttpStatus.OK);
  //     return this._authService.confirmEmail(
  //       ulrToImportCssInEmail,
  //       ulrToImportImagesInEmail,
  //       user
  //     );
  //   }

  //   @Get("test-auth")
  //   @UseGuards(JwtAuthenticationGuard)
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   async testPrivateRoute(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ): Promise<string> {
  //     this._logger.debug("GET: /api/auth/test-auth");
  //     const user: User = await this._userService.getUserFromRequest(request);
  //     response.status(HttpStatus.OK);
  //     return this._authService.testPrivateRoute(user.id);
  //   }

  //   @Get("test-email-confirmed")
  //   @UseGuards(IsEmailConfirmedGuard())
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.FORBIDDEN,
  //     description: "Error: Forbidden",
  //   })
  //   async testEmailConfirmed(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ): Promise<string> {
  //     this._logger.debug("GET: /api/auth/test-email-confirmed");
  //     const user: User = await this._userService.getUserFromRequest(request);
  //     response.status(HttpStatus.OK);
  //     return this._authService.testEmailConfirmed(user.id);
  //   }

  //   @Get("test-role-permission")
  //   @UseGuards(RoleGuard([Role.ADMIN]))
  //   @UseGuards(IsEmailConfirmedGuard())
  //   @ApiBearerAuth()
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.UNAUTHORIZED,
  //     description: "Error: Unauthorized",
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.FORBIDDEN,
  //     description: "Error: Forbidden",
  //   })
  //   async testRolePermission(
  //     @Req() request: Request,
  //     @Res({ passthrough: true }) response: Response
  //   ): Promise<string> {
  //     this._logger.debug("GET: /api/auth/test-role-permission");
  //     const user: User = await this._userService.getUserFromRequest(request);
  //     response.status(HttpStatus.OK);
  //     return this._authService.testRolePermission(user.id);
  //   }
}
