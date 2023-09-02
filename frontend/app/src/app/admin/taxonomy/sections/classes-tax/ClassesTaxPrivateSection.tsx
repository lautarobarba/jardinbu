"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetClassesTax } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreateClassTaxForm } from '../forms/CrudClassTaxForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ClassTax } from '@/interfaces/class-tax.interface';
import { columns } from './columns';

export const ClassesTaxPrivateSection = () => {
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
    <div className='p-3'>
      <PageTitle title='Clases' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de clases' />
        <Button
          color={openCreate ? 'danger' : 'success'}
          radius="sm"
          className="uppercase text-white"
          onClick={toggleCreateForm}
        >
          {openCreate ? 'Cancelar' : 'Crear'}
        </Button>
      </div>

      <br />

      <Modal
        size="5xl"
        radius="sm"
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        isDismissable={false}
      >
        <ModalThemeWrapper>
          <ModalContent>
            <div className='p-5 bg-light dark:bg-dark'>
              <CreateClassTaxForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getClassesTaxIsError && <p className='text-danger'>Error...</p>}

      {getClassesTaxIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
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
