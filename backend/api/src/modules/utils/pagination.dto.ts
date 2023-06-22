import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindOptionsOrder } from "typeorm";

export interface ColumnSort {
  id: [];
  desc: boolean;
}
export type SortingState = ColumnSort[];

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export type ColumnFiltersState = ColumnFilter[];

export interface ColumnFilter {
  id: string;
  value: unknown;
}

export class PaginationDto {
  @ApiPropertyOptional()
  paginationState?: PaginationState;

  @ApiPropertyOptional()
  sortingState?: SortingState;

  @ApiPropertyOptional()
  columnFiltersState?: ColumnFiltersState;
}

export class PaginatedList<T> {
  rows: T[];
  pageCount: number;
}
