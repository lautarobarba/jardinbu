"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetFamilies } from '@/services/hooks';
import { CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreateFamilyForm } from '../forms/CrudFamilyForm';
import { CustomTable } from '../forms/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Family } from '@/interfaces/family.interface';
import { columns } from './columns';

export const FamiliesPrivateSection = () => {
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
    isLoading: getFamiliesIsLoading,
    isSuccess: getFamiliesIsSuccess,
    data: getFamiliesData,
    isError: getFamiliesIsError,
    error: getFamiliesError,
  } = useGetFamilies(
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

  const table = useReactTable<Family>({
    data: getFamiliesData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getFamiliesData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getFamiliesIsSuccess) {
      console.log({ getFamiliesData });
    } else if (getFamiliesIsError) {
      console.log({ getFamiliesError });
    }
  }, [
    getFamiliesIsSuccess,
    getFamiliesData,
    getFamiliesIsError,
    getFamiliesError,
  ]);

  return (
    <div className='p-3'>
      <PageTitle title='Familias' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de familias' />
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
              <CreateFamilyForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getFamiliesIsError && <p className='text-danger'>Error...</p>}

      {getFamiliesIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
        </div>
      )}

      {getFamiliesIsSuccess && (
        <section id='families' className='families'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
