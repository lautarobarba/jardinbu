import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetOrdersTax } from '../../api/hooks';
import { useEffect, useMemo, useState } from 'react';
import { CircularProgress, Dialog } from '@mui/material';
import { CustomTable } from '../../utils/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from './columns';
import { OrderTax } from '../../interfaces/OrderTaxInterface';
import { CreateOrderTaxForm } from '../../forms/CrudOrderTaxForm';

export const OrdersTaxPrivateList = () => {
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
    <div className='bg-white p-3'>
      <PageTitle title='Ordenes' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de ordenes' />
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
          <CreateOrderTaxForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getOrdersTaxIsError && <p className='text-danger'>Error...</p>}

      {getOrdersTaxIsLoading && (
        <div className='text-center'>
          <CircularProgress />
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
