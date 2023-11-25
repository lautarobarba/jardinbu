"use client";
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Role, User } from "@/interfaces/user.interface";
import { useGetUsers } from "@/services/hooks";
import { ModalThemeWrapper } from "@/wrappers/ModalThemeWrapper";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Button, CircularProgress, Input, Modal, ModalContent } from "@nextui-org/react";
import { PaginationState, SortingState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { CustomTable } from "@/components/CustomTable";
import { columns } from "./columns";
import { SearchIcon } from "lucide-react";

const AdminUsersPage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lastname', desc: true },
  ]);
  const [searchKey, setSearchKey] = useState<string>('');

  const handleSearch = (event: any) => {
    setPagination({ pageIndex: 0, pageSize });
    setSearchKey(event.target.value)
  }

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // Queries
  const {
    isLoading: getUsersIsLoading,
    isSuccess: getUsersIsSuccess,
    data: getUsersData,
    isError: getUsersIsError,
    error: getUsersError,
  } = useGetUsers(
    {
      pagination: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        orderBy: sorting.length === 1 ? sorting[0].id : undefined,
        orderDirection:
          sorting.length === 1 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined,
        searchKey: searchKey
      },
    },
    { keepPreviousData: true }
  );

  const table = useReactTable<User>({
    data: getUsersData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getUsersData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getUsersIsSuccess) {
      console.log({ getUsersData });
    } else if (getUsersIsError) {
      console.log({ getUsersError });
    }
  }, [
    getUsersIsSuccess,
    getUsersData,
    getUsersIsError,
    getUsersError,
  ]);

  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN]}>
      <PageTitle title='Usuarios' />

      <div className='p-3'>
        <hr />
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-12 md:col-span-4 order-1 flex justify-center md:justify-start items-center">
            <PageSubTitle title='Listado de usuarios' className='mb-0' />
          </div>

          <div className="col-span-12 md:col-span-4 order-3 md:order-2 flex justify-center items-center">
            <Input
              // Value
              type="search"
              value={searchKey}
              onChange={handleSearch}
              placeholder="Buscar..."
              // Style
              classNames={{
                base: "max-w-full h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              startContent={<SearchIcon size={18} />}
            />
          </div>

          <div className="col-span-12 md:col-span-4 order-2 md:order-3 flex justify-center md:justify-end items-center">
            {/* Placeholder */}
          </div>
        </div>

        <br />

        {getUsersIsError && <p className='text-danger'>Error...</p>}

        {getUsersIsLoading && (
          <div className='flex justify-center'>
            <CircularProgress aria-label="loading" />
          </div>
        )}

        {getUsersIsSuccess && (
          <section id='users' className='users'>
            <CustomTable table={table} totalItems={getUsersData.meta.totalItems ?? 0} />
          </section>
        )}
      </div>
    </RolRequiredPageWrapper>
  );
}
export default AdminUsersPage;