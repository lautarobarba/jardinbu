import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MailerController } from "./mailer.controller";
import { MailerModule as MailerModuleNest } from "@nestjs-modules/mailer";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { UserModule } from "../user/user.module";
import { BullModule } from "@nestjs/bull";
import { ENV_VAR } from "config";

@Module({
  imports: [
    MailerModuleNest.forRoot({
      transport: {
        host: ENV_VAR.SMTP_HOST,
        port: ENV_VAR.SMTP_PORT,
        secure: ENV_VAR.SMTP_SECURE,
        auth: {
          user: ENV_VAR.SMTP_USER,
          pass: ENV_VAR.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, "../../../emails/templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // Redis connection for queues
    BullModule.registerQueue({
      name: "emailSender",
    }),
    UserModule,
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
