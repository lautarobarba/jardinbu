"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetKingdoms } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
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


export const KingdomPrivateSection = () => {
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
    <div className='p-3'>
      <PageTitle title='Reinos' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de reinos' />
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
        scrollBehavior="outside"
      >
        <ModalThemeWrapper>
          <ModalContent>
            <div className='p-5 bg-light dark:bg-dark'>
              <CreateKingdomForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getKingdomsIsError && <p className='text-danger'>Error...</p>}

      {getKingdomsIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
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
