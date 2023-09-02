"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { OrderTax } from '@/interfaces/order-tax.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { ModalCrudOrderTax } from '../forms/CrudOrderTaxForm';

const columnHelper = createColumnHelper<OrderTax>();

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
  columnHelper.accessor('classTax', {
    id: 'classTax',
    // header: 'Clase',
    // cell: (props) => classTaxToString(props.getValue()),
    header: 'Taxonomía',
    cell: (props) => (
      <>
        <strong>Clase:</strong> {classTaxToString(props.getValue())}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().phylum)}.
        <br />
        <strong>Reino:</strong> {kingdomToString(props.getValue().phylum.kingdom)}.
      </>
    ),
    enableSorting: false,
  }),
  // // Accessor Column
  // columnHelper.accessor('classTax', {
  //   id: 'phylum',
  //   header: 'Filo',
  //   cell: (props) => phylumToString(props.getValue().phylum),
  //   enableSorting: false,
  // }),
  // // Accessor Column
  // columnHelper.accessor('classTax', {
  //   id: 'kingdom',
  //   header: 'Reino',
  //   cell: (props) => kingdomToString(props.getValue().phylum.kingdom),
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
    cell: (props) => <ModalCrudOrderTax id={Number(props.row.original.id)} />,
  }),
];
