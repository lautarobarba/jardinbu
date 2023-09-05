import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ENV_VAR } from "config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MailerModule } from "./modules/mailer/mailer.module";
import { CronModule } from "./modules/cron/cron.module";
import { FamilyModule } from "./modules/family/family.module";
import { GenusModule } from "./modules/genus/genus.module";
import { SpeciesModule } from "./modules/species/species.module";
import { SpecimenModule } from "./modules/specimen/specimen.module";
import { QRCodeModule } from "./modules/qr-code/qr-code.module";
import { KingdomModule } from "modules/kingdom/kingdom.module";
import { AdministrationModule } from "modules/administration/administration.module";
import { PhylumModule } from "modules/phylum/phylum.module";
import { ClassTaxModule } from "modules/class-tax/class-tax.module";
import { OrderTaxModule } from "modules/order-tax/order-tax.module";
import { ImageModule } from "modules/image/image.module";
import { TagModule } from "modules/tag/tag.module";
import { LinkModule } from "modules/link/link.module";
import { PostModule } from "modules/post/post.module";

@Module({
  imports: [
    // PostgreSQL connection
    DatabaseModule,
    // Redis connection for queues
    BullModule.forRootAsync({
      useFactory: async () => ({
        redis: {
          host: ENV_VAR.REDIS_HOST,
          port: ENV_VAR.REDIS_PORT,
        },
      }),
    }),
    // Cron Jobs
    ScheduleModule.forRoot(),
    // Auth
    AuthModule,
    UserModule,
    // Utils
    ImageModule,
    MailerModule,
    CronModule,
    // App modules
    KingdomModule,
    PhylumModule,
    ClassTaxModule,
    OrderTaxModule,
    FamilyModule,
    GenusModule,
    TagModule,
    LinkModule,
    SpeciesModule,
    SpecimenModule,
    PostModule,
    QRCodeModule,
    AdministrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor() {
    AppModule.port = ENV_VAR.BACK_PORT;
  }
}
