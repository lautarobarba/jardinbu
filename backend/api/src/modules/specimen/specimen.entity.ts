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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Species } from "../species/species.entity";
import { User } from "../user/user.entity";
import { Image } from "../image/image.entity";
import { Link } from "../link/link.entity";

@Entity("specimens")
export class Specimen extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({
    name: "code",
    type: "varchar",
    nullable: false,
    unique: true,
    length: 255,
  })
  code: string;

  @ApiProperty()
  @Column({
    name: "description",
    type: "text",
    nullable: true,
    unique: false,
  })
  description: string;

  // Relation
  @ApiProperty({
    type: () => Species,
  })
  @ManyToOne(() => Species, (species) => species.specimens, {
    nullable: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    eager: true,
  })
  @JoinColumn({
    name: "species_id",
  })
  species: Species;

  @ApiProperty()
  @Column({
    name: "coord_lat",
    type: "varchar",
    nullable: true,
    unique: false,
  })
  coordLat: string;

  @ApiProperty()
  @Column({
    name: "coord_lon",
    type: "varchar",
    nullable: true,
    unique: false,
  })
  coordLon: string;

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
    name: "specimens_galleries",
    joinColumn: {
      name: "specimen_id",
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
    name: "specimens_links",
    joinColumn: {
      name: "specimen_id",
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
