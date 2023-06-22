import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FamilyService } from "./family.service";
import { FamilyController } from "./family.controller";
import { Family } from "./family.entity";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Family]), UserModule],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
