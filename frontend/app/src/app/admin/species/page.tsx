"use client";
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Role } from "@/interfaces/user.interface";
import { useGetSpecies } from "@/services/hooks";
import { ModalThemeWrapper } from "@/wrappers/ModalThemeWrapper";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Button, CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { PaginationState, SortingState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { CreateSpeciesForm } from "./CrudSpeciesForm";
import { CustomTable } from "../taxonomy/sections/forms/CustomTable";
import { Species } from "@/interfaces/species.interface";
import { columns } from './columns';


const AdminSpeciesPage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'scientificName', desc: false },
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
    isLoading: getSpeciesIsLoading,
    isSuccess: getSpeciesIsSuccess,
    data: getSpeciesData,
    isError: getSpeciesIsError,
    error: getSpeciesError,
  } = useGetSpecies(
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

  const table = useReactTable<Species>({
    data: getSpeciesData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getSpeciesData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getSpeciesIsSuccess) {
      console.log({ getSpeciesData });
    } else if (getSpeciesIsError) {
      console.log({ getSpeciesError });
    }
  }, [
    getSpeciesIsSuccess,
    getSpeciesData,
    getSpeciesIsError,
    getSpeciesError,
  ]);

  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>

      <PageTitle title='Especies' />

      <div className='flex flex-row justify-between'>
        <PageSubTitle title='Listado de especies' />
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
              <CreateSpeciesForm toggleVisibility={setOpenCreate} />
            </div>
          </ModalContent>
        </ModalThemeWrapper>
      </Modal>

      {getSpeciesIsError && <p className='text-danger'>Error...</p>}

      {getSpeciesIsLoading && (
        <div className='flex justify-center'>
          <CircularProgress aria-label="loading" />
        </div>
      )}

      {getSpeciesIsSuccess && (
        <section id='species' className='species'>
          <CustomTable table={table} />
        </section>
      )}
    </RolRequiredPageWrapper>
  );
}
export default AdminSpeciesPage;