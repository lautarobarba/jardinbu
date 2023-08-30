"use client";
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useGetGenera } from '@/services/hooks';
import { useEffect, useMemo, useState } from 'react';
import { CircularProgress, Dialog } from '@mui/material';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from './columns';
import { Genus } from '@/interfaces/genus.interface';
import { CreateGenusForm } from '../forms/CrudGenusForm';

export const GeneraPrivateList = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

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
    error: getGeneraError,
  } = useGetGenera(
    {
      pagination: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        orderBy: sorting.length === 1 ? sorting[0].id : undefined,
        orderDirection:
          sorting.length === 1 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined,
      },
    },
    { keepPreviousData: true }
  );

  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const toggleCreateForm = () => {
    setOpenCreate(!openCreate);
  };

  const table = useReactTable<Genus>({
    data: getGeneraData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getGeneraData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getGeneraIsSuccess) {
      console.log({ getGeneraData });
    } else if (getGeneraIsError) {
      console.log({ getGeneraError });
    }
  }, [getGeneraIsSuccess, getGeneraData, getGeneraIsError, getGeneraError]);

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

      <Dialog
        onClose={() => setOpenCreate(false)}
        open={openCreate}
        maxWidth={'md'}
        fullWidth
      >
        <div className='p-5'>
          <CreateGenusForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getGeneraIsError && <p className='text-danger'>Error...</p>}

      {getGeneraIsLoading && (
        <div className='text-center'>
          <CircularProgress />
        </div>
      )}

      {getGeneraIsSuccess && (
        <section id='genera' className='genera'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
