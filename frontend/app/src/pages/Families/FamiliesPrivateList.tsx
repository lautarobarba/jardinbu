import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetFamilies } from '../../api/hooks';
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
import { Family } from '../../interfaces/FamilyInterface';
import { CreateFamilyForm } from '../../forms/CrudFamilyForm';

export const FamiliesPrivateList = () => {
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
    <div className='bg-white p-3'>
      <PageTitle title='Familias' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de familias' />
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
          <CreateFamilyForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getFamiliesIsError && <p className='text-danger'>Error...</p>}

      {getFamiliesIsLoading && (
        <div className='text-center'>
          <CircularProgress />
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
