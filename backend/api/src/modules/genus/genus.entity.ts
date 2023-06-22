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
import { Species } from "../species/species.entity";
import { Family } from "../family/family.entity";

@Entity("genera")
export class Genus extends BaseEntity {
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
    type: () => Family,
  })
  @ManyToOne(() => Family, (family) => family.genera, {
    cascade: true,
    onDelete: "RESTRICT",
    eager: true,
  })
  @JoinColumn({
    name: "family_id",
  })
  family: Family;

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
    type: () => Species,
    isArray: true,
  })
  @OneToMany(() => Species, (species) => species.genus, {
    eager: false,
  })
  species: Species[];
}
