import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Species } from "../species/species.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { QRCode } from "../qr-code/qr-code.entity";

@Entity("specimens")
export class Specimen extends BaseEntity {
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
    cascade: true,
    onDelete: "RESTRICT",
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
