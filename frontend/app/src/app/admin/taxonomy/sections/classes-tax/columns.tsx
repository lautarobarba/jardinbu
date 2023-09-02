"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { ClassTax } from '@/interfaces/class-tax.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { ModalCrudClassTax } from '../forms/CrudClassTaxForm';

const columnHelper = createColumnHelper<ClassTax>();

export const columns = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  // Accessor Column
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Nombre',
    cell: (props) => (<strong>{formatTitleCase(props.getValue())}</strong>),
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('phylum', {
    id: 'phylum',
    // header: 'Filo',
    // cell: (props) => phylumToString(props.getValue()),
    header: 'Taxonomía',
    cell: (props) => (
      <>
        <strong>Filo:</strong> {phylumToString(props.getValue())}.
        <br />
        <strong>Reino:</strong> {kingdomToString(props.getValue().kingdom)}.
      </>
    ),
    enableSorting: false,
  }),
  // // Accessor Column
  // columnHelper.accessor('phylum', {
  //   id: 'kingdom',
  //   header: 'Reino',
  //   cell: (props) => kingdomToString(props.getValue().kingdom),
  //   enableSorting: false,
  // }),
  // Accessor Column
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Registrado',
    cell: (props) => formatDate(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('updatedAt', {
    id: 'updatedAt',
    header: 'Última modificación',
    cell: (props) => formatDate(props.getValue()),
  }),
  // Display Column
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: (props) => <ModalCrudClassTax id={Number(props.row.original.id)} />,
  }),
];
