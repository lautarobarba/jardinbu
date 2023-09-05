import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export enum BGColor {
  tagBgGreen = "tagBgGreen",
  tagBgBlue = "tagBgBlue",
  tagBgJade = "tagBgJade",
  tagBgLima = "tagBgLima",
  tagBgPink = "tagBgPink",
  tagBgYellow = "tagBgYellow",
  tagBgRed = "tagBgRed",
  tagBgGrey = "tagBgGrey",
  tagBgPurple = "tagBgPurple",
}

@Entity("tags")
export class Tag extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({
    name: "name",
    type: "varchar",
    nullable: false,
    unique: true,
    length: 255,
  })
  name: string;

  @ApiProperty()
  @Column({
    name: "bg_color",
    type: "enum",
    enum: BGColor,
    default: BGColor.tagBgGreen,
    nullable: true,
  })
  bgColor: BGColor;

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
