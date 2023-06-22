import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FamilyModule } from "../family/family.module";
import { GenusService } from "./genus.service";
import { GenusController } from "./genus.controller";
import { Genus } from "./genus.entity";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Genus]), UserModule, FamilyModule],
  controllers: [GenusController],
  providers: [GenusService],
  exports: [GenusService],
})
export class GenusModule {}
