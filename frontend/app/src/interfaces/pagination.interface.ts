// import {
//   ColumnFiltersState,
//   PaginationState,
//   SortingState,
// } from '@tanstack/react-table';

import { SearchSpeciesDto } from "./species.interface";

export interface Pagination {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
  searchKey?: string;
}

export interface PaginationSpecies {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
  search: SearchSpeciesDto;
}

export interface PaginatedList<T> {
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
