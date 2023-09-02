import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "modules/user/user.module";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { Image } from "./image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), UserModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
