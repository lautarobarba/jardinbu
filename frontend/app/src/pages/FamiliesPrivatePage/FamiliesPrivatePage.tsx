import { PageSubTitle } from "../../components/PageSubTitle";
import { PageTitle } from "../../components/PageTitle";
import { Family } from "../../interfaces/FamilyInterface";
import { useGetFamilies } from "../../api/hooks";
import { useEffect, useMemo, useState } from "react";
import { CreateFamilyForm } from "../../forms/CrudFamilyForm";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { fuzzyFilter } from "../../utils/ColumnFilter";
import { CustomTable } from "../../utils/CustomTable";
import { CircularProgress } from "@mui/material";
import { GlideTable } from "../SpeciesPrivatePage/GlideTable";

export const FamiliesPrivatePage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    // error: getFamiliesError
  } = useGetFamilies(
    {
      pagination: {
        paginationState: pagination,
        sortingState: sorting,
        columnFiltersState: columnFilters,
      },
    },
    { keepPreviousData: true }
  );

  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const toggleCreateForm = () => {
    setOpenCreate(!openCreate);
  };

  const table = useReactTable<Family>({
    data: getFamiliesData?.rows ?? [],
    columns: columns,
    state: { pagination, sorting, columnFilters },
    manualPagination: true,
    pageCount: getFamiliesData?.pageCount ?? -1,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableMultiSort: true,
    onSortingChange: setSorting,
    enableSorting: true,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (getFamiliesIsSuccess) {
      console.log({ getFamiliesData });
    }
  }, [getFamiliesIsSuccess, getFamiliesData]);

  return (
    <div className="bg-white p-3">
      <PageTitle title="Familias" />

      <div className="d-flex justify-content-between">
        <PageSubTitle title="Listado de familias" />
        <button
          className={
            openCreate
              ? "btn bg-danger text-white"
              : "btn bg-success text-white"
          }
          onClick={toggleCreateForm}
        >
          {openCreate ? "Cancelar" : "Crear"}
        </button>
      </div>

      <br />

      {openCreate && <CreateFamilyForm toggleVisibility={setOpenCreate} />}

      {getFamiliesIsError && <p className="text-danger">Error...</p>}

      {getFamiliesIsLoading && <CircularProgress />}

      {getFamiliesIsSuccess && (
        <section id="families" className="families">
          <CustomTable table={table} />
        </section>
      )}
    </div>
  );
};
