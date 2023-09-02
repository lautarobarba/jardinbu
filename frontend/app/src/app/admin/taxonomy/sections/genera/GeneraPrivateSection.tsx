"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetGenera } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreateGenusForm } from '../forms/CrudGenusForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Genus } from '@/interfaces/genus.interface';
import { columns } from './columns';

export const GeneraPrivateSection = () => {
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
    <div className='p-3'>
      <PageTitle title='Géneros' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de géneros' />
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
              <CreateGenusForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getGeneraIsError && <p className='text-danger'>Error...</p>}

      {getGeneraIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
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
