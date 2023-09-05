import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkService } from "./link.service";
import { LinkController } from "./link.controller";
import { Link } from "./link.entity";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Link]), UserModule],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
