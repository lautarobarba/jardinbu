import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Tag } from "../tag/tag.entity";
import { Link } from "../link/link.entity";
import { Image } from "../image/image.entity";

@Entity("posts")
export class Post extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({
    name: "spanish_title",
    type: "varchar",
    nullable: false,
    unique: false,
    length: 255,
  })
  spanishTitle: string;

  @ApiProperty()
  @Column({
    name: "english_title",
    type: "varchar",
    nullable: true,
    unique: false,
    length: 255,
  })
  englishTitle: string;

  // Relation
  @ApiProperty({
    type: () => Image,
  })
  @OneToOne(() => Image, () => {}, {
    cascade: true,
    onDelete: "RESTRICT",
    eager: true,
  })
  @JoinColumn({
    name: "cover_img_id",
  })
  coverImg: Image;

  @ApiProperty()
  @Column({
    name: "spanish_content",
    type: "text",
    nullable: false,
    unique: false,
  })
  spanishContent: string;

  @ApiProperty()
  @Column({
    name: "english_content",
    type: "text",
    nullable: true,
    unique: false,
  })
  englishContent: string;

  // Relation
  @ApiProperty({
    type: () => Tag,
    isArray: true,
  })
  @ManyToMany(() => Tag, () => {}, {
    cascade: true,
    onDelete: "RESTRICT",
    eager: true,
  })
  @JoinTable({
    name: "posts_tags",
    joinColumn: {
      name: "post_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags: Tag[];

  // Relation
  @ApiProperty({
    type: () => Image,
    isArray: true,
  })
  @ManyToMany(() => Image, () => {}, {
    cascade: true,
    onDelete: "RESTRICT",
    eager: true,
  })
  @JoinTable({
    name: "posts_galleries",
    joinColumn: {
      name: "post_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  galleryImg: Image[];

  // Relation
  @ApiProperty({
    type: () => Link,
    isArray: true,
  })
  @ManyToMany(() => Link, () => {}, {
    cascade: true,
    onDelete: "RESTRICT",
    eager: true,
  })
  @JoinTable({
    name: "posts_links",
    joinColumn: {
      name: "post_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "link_id",
      referencedColumnName: "id",
    },
  })
  links: Link[];

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ApiProperty()
  @Column({ name: "deleted", type: "boolean", default: false })
  deleted: boolean;

  // Relation
  @ApiProperty({
    type: () => User,
    isArray: false,
  })
  @ManyToOne(() => User, () => {}, {
    nullable: true,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    eager: false,
  })
  @JoinColumn({
    name: "user_mod_id",
  })
  userMod: User;
}
