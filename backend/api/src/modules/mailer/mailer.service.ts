import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Job, Queue } from "bull";
import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { MailerService as MailerServiceNode } from "@nestjs-modules/mailer";
import { UserService } from "modules/user/user.service";
import { User } from "modules/user/user.entity";
import { ENV_VAR } from "config";
import { ERROR_MESSAGE } from "modules/utils/error-message";

@Processor("emailSender")
@Injectable()
export class MailerService {
  constructor(
    @InjectQueue("emailSender")
    private readonly _emailSenderQueue: Queue,
    private readonly _mailerServiceNode: MailerServiceNode,
    private readonly _userService: UserService
  ) {}
  private readonly _logger = new Logger(MailerService.name);

  // Envía la tarea 'handleSendTestEmail' a la cola
  async sendTestEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendTestEmail()");
    this._logger.debug(`Se enviará un correo de prueba a ${userEmail}`);

    const job: Job = await this._emailSenderQueue.add("handleSendTestEmail", {
      ulrToImportCssInEmail: ulrToImportCssInEmail,
      ulrToImportImagesInEmail: ulrToImportImagesInEmail,
      mailbox: overwriteEmail ?? userEmail,
    });

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendTestEmail' de la cola
  @Process("handleSendTestEmail")
  async handleSendTestEmail(job: Job) {
    this._logger.debug("handleSendTestEmail()");
    const { ulrToImportCssInEmail, ulrToImportImagesInEmail, mailbox } =
      job.data;
    this._logger.debug(
      `handleSendTestEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Correo de prueba - Jardín Botánico de Ushuaia",
        template: "./test", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          mailbox: mailbox,
        },
      });
      this._logger.debug(
        `handleSendTestEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendTestEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }

  // Envía la tarea 'handleSendRegistrationEmail' a la cola
  async sendRegistrationEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    accessToken: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendRegistrationEmail()");
    const user: User = await this._userService.findOneByEmail(userEmail);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    const job: Job = await this._emailSenderQueue.add(
      "handleSendRegistrationEmail",
      {
        ulrToImportCssInEmail: ulrToImportCssInEmail,
        ulrToImportImagesInEmail: ulrToImportImagesInEmail,
        user: user,
        accessToken,
        mailbox: overwriteEmail ?? userEmail,
      }
    );

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendRegistrationEmail' de la cola
  @Process("handleSendRegistrationEmail")
  async handleSendRegistrationEmail(job: Job) {
    this._logger.debug("handleSendRegistrationEmail()");
    const {
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user,
      accessToken,
      mailbox,
    } = job.data;
    this._logger.debug(
      `handleSendRegistrationEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    // Ruta para confirmar el correo electrónico en el frontend
    const emailConfirmationUrl: string = `${ENV_VAR.EMAIL_CONFIRMATION_URL}/${accessToken}`;

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Registro - Jardín Botánico de Ushuaia",
        template: "./registration", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          user: user,
          emailConfirmationUrl,
        },
      });
      this._logger.debug(
        `handleSendRegistrationEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendRegistrationEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }

  // Envía la tarea 'handleSendEmailConfirmationEmail' a la cola
  async sendEmailConfirmationEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    accessToken: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendEmailConfirmationEmail()");
    const user: User = await this._userService.findOneByEmail(userEmail);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    const job: Job = await this._emailSenderQueue.add(
      "handleSendEmailConfirmationEmail",
      {
        ulrToImportCssInEmail: ulrToImportCssInEmail,
        ulrToImportImagesInEmail: ulrToImportImagesInEmail,
        user: user,
        accessToken,
        mailbox: overwriteEmail ?? userEmail,
      }
    );

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendEmailConfirmationEmail' de la cola
  @Process("handleSendEmailConfirmationEmail")
  async handleSendEmailConfirmationEmail(job: Job) {
    this._logger.debug("handleSendEmailConfirmationEmail()");
    const {
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user,
      accessToken,
      mailbox,
    } = job.data;
    this._logger.debug(
      `handleSendEmailConfirmationEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    // Ruta para confirmar el correo electrónico en el frontend
    const emailConfirmationUrl: string = `${ENV_VAR.EMAIL_CONFIRMATION_URL}/${accessToken}`;

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Validar correo - Jardín Botánico de Ushuaia",
        template: "./email-confirmation", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          user: user,
          emailConfirmationUrl,
        },
      });
      this._logger.debug(
        `handleSendEmailConfirmationEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendEmailConfirmationEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }

  // Envía la tarea 'handleSendEmailConfirmedEmail' a la cola
  async sendEmailConfirmedEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendEmailConfirmedEmail()");
    const user: User = await this._userService.findOneByEmail(userEmail);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    const job: Job = await this._emailSenderQueue.add(
      "handleSendEmailConfirmedEmail",
      {
        ulrToImportCssInEmail: ulrToImportCssInEmail,
        ulrToImportImagesInEmail: ulrToImportImagesInEmail,
        user: user,
        mailbox: overwriteEmail ?? userEmail,
      }
    );

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendEmailConfirmedEmail' de la cola
  @Process("handleSendEmailConfirmedEmail")
  async handleSendEmailConfirmedEmail(job: Job) {
    this._logger.debug("handleSendEmailConfirmedEmail()");
    const { ulrToImportCssInEmail, ulrToImportImagesInEmail, user, mailbox } =
      job.data;
    this._logger.debug(
      `handleSendEmailConfirmedEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Confirmación correcta - Jardín Botánico de Ushuaia",
        template: "./email-confirmed", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          user: user,
        },
      });
      this._logger.debug(
        `handleSendEmailConfirmedEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendEmailConfirmedEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }

  // Envía la tarea 'handleSendRecoverPasswordEmail' a la cola
  async sendRecoverPasswordEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    accessToken: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendRecoverPasswordEmail()");
    const user: User = await this._userService.findOneByEmail(userEmail);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    const job: Job = await this._emailSenderQueue.add(
      "handleSendRecoverPasswordEmail",
      {
        ulrToImportCssInEmail: ulrToImportCssInEmail,
        ulrToImportImagesInEmail: ulrToImportImagesInEmail,
        user: user,
        accessToken,
        mailbox: overwriteEmail ?? userEmail,
      }
    );

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendRecoverPasswordEmail' de la cola
  @Process("handleSendRecoverPasswordEmail")
  async handleSendRecoverPasswordEmail(job: Job) {
    this._logger.debug("handleSendRecoverPasswordEmail()");
    const {
      ulrToImportCssInEmail,
      ulrToImportImagesInEmail,
      user,
      accessToken,
      mailbox,
    } = job.data;
    this._logger.debug(
      `handleSendRecoverPasswordEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    // Ruta para cambiar la contraseña en el frontend
    const passwordRecoveryUrl: string = `${ENV_VAR.PASSWORD_RECOVERY_URL}/${accessToken}`;

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Recuperar contraseña - Jardín Botánico de Ushuaia",
        template: "./recover-password", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          user: user,
          passwordRecoveryUrl,
        },
      });
      this._logger.debug(
        `handleSendRecoverPasswordEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendRecoverPasswordEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }

  // Envía la tarea 'handleSendPasswordChangedEmail' a la cola
  async sendPasswordChangedEmail(
    ulrToImportCssInEmail: string,
    ulrToImportImagesInEmail: string,
    userEmail: string,
    overwriteEmail?: string
  ) {
    this._logger.debug("sendPasswordChangedEmail()");
    const user: User = await this._userService.findOneByEmail(userEmail);

    if (!user) {
      this._logger.debug(ERROR_MESSAGE.NO_ENCONTRADO);
      throw new NotFoundException(ERROR_MESSAGE.NO_ENCONTRADO);
    }

    const job: Job = await this._emailSenderQueue.add(
      "handleSendPasswordChangedEmail",
      {
        ulrToImportCssInEmail: ulrToImportCssInEmail,
        ulrToImportImagesInEmail: ulrToImportImagesInEmail,
        user: user,
        mailbox: overwriteEmail ?? userEmail,
      }
    );

    // console.log(job);
    return {
      jobID: job.id,
    };
  }

  // Ejecula la próxima tarea 'handleSendPasswordChangedEmail' de la cola
  @Process("handleSendPasswordChangedEmail")
  async handleSendPasswordChangedEmail(job: Job) {
    this._logger.debug("handleSendPasswordChangedEmail()");
    const { ulrToImportCssInEmail, ulrToImportImagesInEmail, user, mailbox } =
      job.data;
    this._logger.debug(
      `handleSendPasswordChangedEmail: BEGIN Enviando correo a- ${mailbox}`
    );

    try {
      await this._mailerServiceNode.sendMail({
        to: mailbox,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: "Contraseña actualizada - Jardín Botánico de Ushuaia",
        template: "./password-changed", // `.hbs` extension is appended automatically
        context: {
          ulrToImportCssInEmail: ulrToImportCssInEmail,
          ulrToImportImagesInEmail: ulrToImportImagesInEmail,
          user: user,
        },
      });
      this._logger.debug(
        `handleSendPasswordChangedEmail: END Enviando correo a- ${mailbox}`
      );
    } catch (error) {
      this._logger.debug(
        `handleSendPasswordChangedEmail: ERROR Enviando correo a- ${mailbox}`
      );
      console.log(error);
    }
  }
}
