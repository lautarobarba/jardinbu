import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetGenera } from '../../api/hooks';
import { useEffect, useMemo, useState } from 'react';
import { Genus } from '../../interfaces/GenusInterface';
import { CreateGenusForm } from '../../forms/CrudGenusForm';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '../../utils/ColumnFilter';
import { columns } from './columns';
import { CircularProgress } from '@mui/material';
import { CustomTable } from '../../utils/CustomTable';

export const GeneraPrivatePage = () => {
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
    isLoading: getGeneraIsLoading,
    isSuccess: getGeneraIsSuccess,
    data: getGeneraData,
    isError: getGeneraIsError,
    // error: getGeneraError
  } = useGetGenera(
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

  const table = useReactTable<Genus>({
    data: getGeneraData?.rows ?? [],
    columns: columns,
    state: { pagination, sorting, columnFilters },
    manualPagination: true,
    pageCount: getGeneraData?.pageCount ?? -1,
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
    if (getGeneraData) {
      console.log({ getGeneraData });
    }
  }, [getGeneraIsSuccess, getGeneraData]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Géneros' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de géneros' />
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

      {openCreate && <CreateGenusForm toggleVisibility={setOpenCreate} />}

      {getGeneraIsError && <p className='text-danger'>Error...</p>}

      {getGeneraIsLoading && <CircularProgress />}

      {getGeneraIsSuccess && (
        <section id='genera' className='genera'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
