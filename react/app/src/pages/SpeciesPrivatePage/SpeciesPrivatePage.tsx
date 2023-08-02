import { PageSubTitle } from '../../components/PageSubTitle';
import { PageTitle } from '../../components/PageTitle';
import { useGetSpecies } from '../../api/hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fuzzyFilter } from '../../utils/ColumnFilter';
import { CustomTable } from '../../utils/CustomTable';
import { CircularProgress, Dialog } from '@mui/material';
import { Species } from '../../interfaces/SpeciesInterface';
import { columns } from './columns';
import { CreateSpeciesForm } from '../../forms/CrudSpeciesForm';

export const SpeciesPrivatePage = () => {
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
  }, [getSpeciesIsSuccess, getSpeciesData, getSpeciesIsError, getSpeciesError]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Especies' />

      <div className='d-flex justify-content-between'>
        <PageSubTitle title='Listado de especies' />
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
          <CreateSpeciesForm toggleVisibility={setOpenCreate} />
        </div>
      </Dialog>

      {getSpeciesIsError && <p className='text-danger'>Error...</p>}

      {getSpeciesIsLoading && (
        <div className='text-center'>
          <CircularProgress />
        </div>
      )}

      {getSpeciesIsSuccess && (
        <section id='species' className='species'>
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
