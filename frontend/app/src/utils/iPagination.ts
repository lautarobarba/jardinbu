import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

export interface PaginatedList<T> {
  rows: T[];
  pageCount: number;
}

export interface Pagination {
  paginationState: PaginationState;
  sortingState: SortingState;
  columnFiltersState: ColumnFiltersState;
}
