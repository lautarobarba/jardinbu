"use client";
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useGetClassesTax } from '@/services/hooks';
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
import { ClassTax } from '@/interfaces/class-tax.interface';
import { CreateClassTaxForm } from '../forms/CrudClassTaxForm';

export const ClassesTaxPrivateList = () => {
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
    isLoading: getClassesTaxIsLoading,
    isSuccess: getClassesTaxIsSuccess,
    data: getClassesTaxData,
    isError: getClassesTaxIsError,
    error: getClassesTaxError,
  } = useGetClassesTax(
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

  const table = useReactTable<ClassTax>({
    data: getClassesTaxData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getClassesTaxData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getClassesTaxIsSuccess) {
      console.log({ getClassesTaxData });
    } else if (getClassesTaxIsError) {
      console.log({ getClassesTaxError });
    }
  }, [
    getClassesTaxIsSuccess,
    getClassesTaxData,
    getClassesTaxIsError,
    getClassesTaxError,
  ]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Clases' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de clases' />
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
          <CreateClassTaxForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getClassesTaxIsError && <p className='text-danger'>Error...</p>}

      {getClassesTaxIsLoading && (
        <div className='text-center'>
          <CircularProgress />
        </div>
      )}

      {getClassesTaxIsSuccess && (
        <section id='classes-tax' className='classes-tax'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
