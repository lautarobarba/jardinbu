import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("qr_codes")
export class QRCode extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({
    name: "uuid",
    type: "varchar",
    nullable: false,
    unique: true,
    length: 255,
  })
  uuid: string;

  @ApiProperty()
  @Column({
    name: "title",
    type: "varchar",
    nullable: false,
    unique: true,
    length: 255,
  })
  title: string;

  @ApiProperty()
  @Column({
    name: "link",
    type: "varchar",
    nullable: false,
    unique: true,
    length: 255,
  })
  link: string;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ApiProperty()
  @Column({ name: "deleted", type: "boolean", default: false })
  deleted: boolean;
}
