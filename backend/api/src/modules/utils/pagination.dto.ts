import { ApiPropertyOptional } from "@nestjs/swagger";
import { SearchSpeciesDto } from "modules/species/species.dto";

export class PaginationDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  orderBy?: string;

  @ApiPropertyOptional()
  orderDirection?: string;

  @ApiPropertyOptional()
  searchKey?: string;
}

export class PaginationSpeciesDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  orderBy?: string;

  @ApiPropertyOptional()
  orderDirection?: string;

  @ApiPropertyOptional()
  search?: SearchSpeciesDto;
}
