"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { useGetPhylums } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreatePhylumForm } from '../forms/CrudPhylumForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Phylum } from '@/interfaces/phylum.interface';
import { columns } from './columns';

export const PhylumPrivateSection = () => {
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
    isLoading: getPhylumsIsLoading,
    isSuccess: getPhylumsIsSuccess,
    data: getPhylumsData,
    isError: getPhylumsIsError,
    error: getPhylumsError,
  } = useGetPhylums(
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

  const table = useReactTable<Phylum>({
    data: getPhylumsData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getPhylumsData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getPhylumsIsSuccess) {
      console.log({ getPhylumsData });
    } else if (getPhylumsIsError) {
      console.log({ getPhylumsError });
    }
  }, [getPhylumsIsSuccess, getPhylumsData, getPhylumsIsError, getPhylumsError]);

  return (
    <div className='p-3'>
      <PageTitle title='Filos' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de filos' />
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
              <CreatePhylumForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getPhylumsIsError && <p className='text-danger'>Error...</p>}

      {getPhylumsIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
        </div>
      )}

      {getPhylumsIsSuccess && (
        <section id='phylums' className='phylums'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
