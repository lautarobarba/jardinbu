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
// TODO: Eliminar todo lo de arriba
// TODO: Reemplazar Pagination con PaginationDto
export interface PaginationNew {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
}

// TODO: Reemplazar PaginatedList con PaginatedListNew
export interface PaginatedListNew<T> {
  items: T[];
  meta: {
    itemCount: number;
    totalItems?: number;
    itemsPerPage: number;
    totalPages?: number;
    currentPage: number;
  };
  links: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}
