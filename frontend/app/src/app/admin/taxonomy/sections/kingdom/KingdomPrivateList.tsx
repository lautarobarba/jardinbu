"use client";
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useGetKingdoms } from '@/services/hooks';
import { useEffect, useMemo, useState } from 'react';
import { CircularProgress, Dialog } from '@mui/material';
import { CreateKingdomForm } from '../forms/CrudKingdomForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Kingdom } from '@/interfaces/kingdom.interface';
import { columns } from './columns';

export const KingdomPrivateList = () => {
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
    isLoading: getKingdomsIsLoading,
    isSuccess: getKingdomsIsSuccess,
    data: getKingdomsData,
    isError: getKingdomsIsError,
    error: getKingdomsError,
  } = useGetKingdoms(
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

  const table = useReactTable<Kingdom>({
    data: getKingdomsData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getKingdomsData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getKingdomsIsSuccess) {
      console.log({ getKingdomsData });
    } else if (getKingdomsIsError) {
      console.log({ getKingdomsError });
    }
  }, [
    getKingdomsIsSuccess,
    getKingdomsData,
    getKingdomsIsError,
    getKingdomsError,
  ]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Reinos' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de reinos' />
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
          <CreateKingdomForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getKingdomsIsError && <p className='text-danger'>Error...</p>}

      {getKingdomsIsLoading && (
        <div className='text-center'>
          <CircularProgress />
        </div>
      )}

      {getKingdomsIsSuccess && (
        <section id='kingdoms' className='kingdoms'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
