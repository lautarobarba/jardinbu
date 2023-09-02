"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetOrdersTax } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreateOrderTaxForm } from '../forms/CrudOrderTaxForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { OrderTax } from '@/interfaces/order-tax.interface';
import { columns } from './columns';

export const OrdersTaxPrivateSection = () => {
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
    isLoading: getOrdersTaxIsLoading,
    isSuccess: getOrdersTaxIsSuccess,
    data: getOrdersTaxData,
    isError: getOrdersTaxIsError,
    error: getOrdersTaxError,
  } = useGetOrdersTax(
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

  const table = useReactTable<OrderTax>({
    data: getOrdersTaxData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getOrdersTaxData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getOrdersTaxIsSuccess) {
      console.log({ getOrdersTaxData });
    } else if (getOrdersTaxIsError) {
      console.log({ getOrdersTaxError });
    }
  }, [
    getOrdersTaxIsSuccess,
    getOrdersTaxData,
    getOrdersTaxIsError,
    getOrdersTaxError,
  ]);

  return (
    <div className='p-3'>
      <PageTitle title='Ordenes' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de ordenes' />
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
              <CreateOrderTaxForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getOrdersTaxIsError && <p className='text-danger'>Error...</p>}

      {getOrdersTaxIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
        </div>
      )}

      {getOrdersTaxIsSuccess && (
        <section id='orders-tax' className='orders-tax'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
