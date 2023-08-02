import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetPhylums } from '../../api/hooks';
import { useEffect, useMemo, useState } from 'react';
import { CircularProgress, Dialog } from '@mui/material';
import { CreatePhylumForm } from '../../forms/CrudPhylumForm';
import { CustomTable } from '../../utils/CustomTable';
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Phylum } from '../../interfaces/PhylumInterface';
import { columns } from './columns';

export const PhylumPrivateList = () => {
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
    <div className='bg-white p-3'>
      <PageTitle title='Filos' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de filos' />
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
          <CreatePhylumForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getPhylumsIsError && <p className='text-danger'>Error...</p>}

      {getPhylumsIsLoading && (
        <div className='text-center'>
          <CircularProgress />
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
