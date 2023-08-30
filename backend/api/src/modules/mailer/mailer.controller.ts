import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { EmailTestDto } from "./mailer.dto";
import { MailerService } from "./mailer.service";
import { ENV_VAR } from "config";
import { RoleGuard } from "modules/auth/guards/role.guard";
import { Role } from "modules/auth/role.enum";
import { IsEmailConfirmedGuard } from "modules/auth/guards/is-email-confirmed.guard";

@ApiTags("Emails")
@Controller("mailer")
export class MailerController {
  constructor(private readonly _mailerService: MailerService) {}
  private readonly _logger = new Logger(MailerController.name);

  @Post("test-email")
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email sent",
  })
  async sendTestEmail(
    @Req() request: Request,
    @Body() emailTestDto: EmailTestDto
  ) {
    this._logger.debug("POST: /api/mailer/test-email");
    const ulrToImportCssInEmail: string = ENV_VAR.INTERNAL_LINK;
    const ulrToImportImagesInEmail: string = ENV_VAR.EXTERNAL_LINK;
    // console.log(ulrToImportCssInEmail);
    // console.log(ulrToImportImagesInEmail);

    return this._mailerService.sendTestEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      emailTestDto.userEmail,
      emailTestDto.overwriteEmail
    );
  }

  @Post("test-register-email")
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email sent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Error: Not Found",
  })
  async sendRegistrationEmail(
    @Req() request: Request,
    @Body() emailTestDto: EmailTestDto
  ) {
    this._logger.debug("POST: /api/mailer/test-register-email");
    const ulrToImportCssInEmail: string = ENV_VAR.INTERNAL_LINK;
    const ulrToImportImagesInEmail: string = ENV_VAR.EXTERNAL_LINK;
    // console.log(ulrToImportCssInEmail);
    // console.log(ulrToImportImagesInEmail);

    return this._mailerService.sendRegistrationEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      emailTestDto.userEmail,
      emailTestDto.overwriteEmail
    );
  }

  @Post("test-email-confirmation-email")
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email sent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Error: Not Found",
  })
  async sendEmailConfirmationEmail(
    @Req() request: Request,
    @Body() emailTestDto: EmailTestDto
  ) {
    this._logger.debug("POST: /api/mailer/test-email-confirmation-email");
    const ulrToImportCssInEmail: string = ENV_VAR.INTERNAL_LINK;
    const ulrToImportImagesInEmail: string = ENV_VAR.EXTERNAL_LINK;
    // console.log(ulrToImportCssInEmail);
    // console.log(ulrToImportImagesInEmail);

    return this._mailerService.sendEmailConfirmationEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      emailTestDto.userEmail,
      "Fake-Access-Token",
      emailTestDto.overwriteEmail
    );
  }

  @Post("test-email-confirmed-email")
  @UseGuards(RoleGuard([Role.ADMIN]))
  @UseGuards(IsEmailConfirmedGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email sent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Error: Not Found",
  })
  async sendEmailConfirmedEmail(
    @Req() request: Request,
    @Body() emailTestDto: EmailTestDto
  ) {
    this._logger.debug("POST: /api/mailer/test-email-confirmed-email");
    const ulrToImportCssInEmail: string = ENV_VAR.INTERNAL_LINK;
    const ulrToImportImagesInEmail: string = ENV_VAR.EXTERNAL_LINK;
    // console.log(ulrToImportCssInEmail);
    // console.log(ulrToImportImagesInEmail);

    return this._mailerService.sendEmailConfirmedEmail(
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      emailTestDto.userEmail,
      emailTestDto.overwriteEmail
    );
  }
}
