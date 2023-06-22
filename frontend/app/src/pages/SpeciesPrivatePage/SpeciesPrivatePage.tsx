import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetSpecies } from '../../api/hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '../../utils/ColumnFilter';
import { CustomTable } from '../../utils/CustomTable';
import { CircularProgress } from '@mui/material';
import { Species } from '../../interfaces/SpeciesInterface';
import { columns } from './columns';
import { CreateSpeciesForm } from '../../forms/CrudSpeciesForm';

export const SpeciesPrivatePage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // Queries
  const {
    isLoading: getSpeciesIsLoading,
    isSuccess: getSpeciesIsSuccess,
    data: getSpeciesData,
    isError: getSpeciesIsError,
    // error: getSpeciesError
  } = useGetSpecies(
    {
      pagination: {
        paginationState: pagination,
        sortingState: sorting,
        columnFiltersState: columnFilters,
      },
    },
    { keepPreviousData: true }
  );

  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const toggleCreateForm = () => {
    setOpenCreate(!openCreate);
  };

  const table = useReactTable<Species>({
    data: getSpeciesData?.rows ?? [],
    columns: columns,
    state: { pagination, sorting, columnFilters },
    manualPagination: true,
    pageCount: getSpeciesData?.pageCount ?? -1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: true,
    onSortingChange: setSorting,
    enableSorting: true,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getSpeciesIsSuccess) {
      console.log({ getSpeciesData });
    }
  }, [getSpeciesIsSuccess, getSpeciesData]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Especies' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de especies' />
        <button
          className={
            openCreate
              ? 'btn bg-danger text-white'
              : 'btn bg-success text-white'
          }
          onClick={toggleCreateForm}
        >
          {openCreate ? 'Cancelar' : 'Crear'}
        </button>
      </div>

      <br />

      {openCreate && <CreateSpeciesForm toggleVisibility={setOpenCreate} />}

      {getSpeciesIsError && <p className='text-danger'>Error...</p>}

      {getSpeciesIsLoading && <CircularProgress />}

      {getSpeciesIsSuccess && (
        <section id='species' className='species'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
