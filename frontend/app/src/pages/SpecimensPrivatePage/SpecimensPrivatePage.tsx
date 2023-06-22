import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetSpecimens } from '../../api/hooks';
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
import { columns } from './columns';
import { Specimen } from '../../interfaces/SpecimenInterface';
import { CreateSpecimenForm } from '../../forms/CrudSpecimenForm';

export const SpecimensPrivatePage = () => {
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
    isLoading: getSpecimensIsLoading,
    isSuccess: getSpecimensIsSuccess,
    data: getSpecimensData,
    isError: getSpecimensIsError,
    // error: getSpecimensError
  } = useGetSpecimens(
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

  const table = useReactTable<Specimen>({
    data: getSpecimensData?.rows ?? [],
    columns: columns,
    state: { pagination, sorting, columnFilters },
    manualPagination: true,
    pageCount: getSpecimensData?.pageCount ?? -1,
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
    if (getSpecimensIsSuccess) {
      console.log({ getSpecimensData });
    }
  }, [getSpecimensIsSuccess, getSpecimensData]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Ejemplares' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de ejemplares' />
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

      {openCreate && <CreateSpecimenForm toggleVisibility={setOpenCreate} />}

      {getSpecimensIsError && <p className='text-danger'>Error...</p>}

      {getSpecimensIsLoading && <CircularProgress />}

      {getSpecimensIsSuccess && (
        <section id='specimens' className='specimens'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
