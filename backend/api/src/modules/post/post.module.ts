import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { Post } from "./post.entity";
import { UserModule } from "modules/user/user.module";
import { ImageModule } from "modules/image/image.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, ImageModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
