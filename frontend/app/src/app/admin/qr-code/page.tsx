'use client';
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Role } from "@/interfaces/user.interface";
import { useGetQRCodes } from "@/services/hooks";
import { ModalThemeWrapper } from "@/wrappers/ModalThemeWrapper";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Button, CircularProgress, Input, Modal, ModalContent } from "@nextui-org/react";
import { PaginationState, SortingState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { CreateQRCodeForm } from "./CrudQRCodeForm";
import { CustomTable } from "@/components/CustomTable";
import { QRCode } from "@/interfaces/qr-code.interface";
import { columns } from "./columns";
import { SearchIcon } from "lucide-react";

const QRCodePage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'title', desc: true },
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
    isLoading: getQRCodesIsLoading,
    isSuccess: getQRCodesIsSuccess,
    data: getQRCodesData,
    isError: getQRCodesIsError,
    error: getQRCodesError,
  } = useGetQRCodes(
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

  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const toggleCreateForm = () => {
    setOpenCreate(!openCreate);
  };

  const table = useReactTable<QRCode>({
    data: getQRCodesData?.items ?? [],
    columns: columns,
    state: { pagination, sorting },
    manualPagination: true,
    pageCount: getQRCodesData?.meta?.totalPages ?? 1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: setSorting,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getQRCodesIsSuccess) {
      console.log({ getQRCodesData });
    } else if (getQRCodesIsError) {
      console.log({ getQRCodesError });
    }
  }, [
    getQRCodesIsSuccess,
    getQRCodesData,
    getQRCodesIsError,
    getQRCodesError,
  ]);

  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN]}>
      <PageTitle title='Códigos QR' />

      <div className='p-3'>
        <hr />
        <div className="grid grid-cols-12 gap-2 mt-2">
          <div className="col-span-12 md:col-span-4 order-1 flex justify-center md:justify-start items-center">
            <PageSubTitle title='Listado de códigos QR' className='mb-0' />
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
            <Button
              color={openCreate ? 'danger' : 'success'}
              radius="sm"
              className="uppercase text-white w-full md:w-auto h-8"
              onClick={toggleCreateForm}
            >
              {openCreate ? 'Cancelar' : 'Nuevo'}
            </Button>
          </div>
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
                <CreateQRCodeForm toggleVisibility={setOpenCreate} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>

        {getQRCodesIsError && <p className='text-danger'>Error...</p>}

        {getQRCodesIsLoading && (
          <div className='flex justify-center'>
            <CircularProgress aria-label="loading" />
          </div>
        )}

        {getQRCodesIsSuccess && (
          <section id='qr-codes' className='qr-codes'>
            <CustomTable table={table} totalItems={getQRCodesData.meta.totalItems ?? 0} />
          </section>
        )}
      </div>
    </RolRequiredPageWrapper>
  );
}
export default QRCodePage;