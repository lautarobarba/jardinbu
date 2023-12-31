import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpeciesService } from "./species.service";
import { SpeciesController } from "./species.controller";
import { Species } from "./species.entity";
import { GenusModule } from "../genus/genus.module";
import { UserModule } from "modules/user/user.module";
import { ImageModule } from "modules/image/image.module";
import { LinkModule } from "modules/link/link.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Species]),
    UserModule,
    GenusModule,
    ImageModule,
    LinkModule,
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService],
})
export class SpeciesModule {}
