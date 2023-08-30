"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { Family } from '@/interfaces/family.interface';
import { orderTaxToString } from '@/interfaces/order-tax.interface';
import { ModalCrudFamily } from '../forms/CrudFamilyForm';

const columnHelper = createColumnHelper<Family>();

export const columns = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  // Accessor Column
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Nombre',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('orderTax', {
    id: 'orderTax',
    header: 'Orden',
    cell: (props) => orderTaxToString(props.getValue()),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('orderTax', {
    id: 'classTax',
    header: 'Clase',
    cell: (props) => classTaxToString(props.getValue().classTax),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('orderTax', {
    id: 'phylum',
    header: 'Filo',
    cell: (props) => phylumToString(props.getValue().classTax.phylum),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('orderTax', {
    id: 'kingdom',
    header: 'Reino',
    cell: (props) => kingdomToString(props.getValue().classTax.phylum.kingdom),
    enableSorting: false,
  }),
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
    cell: (props) => <ModalCrudFamily id={Number(props.row.original.id)} />,
  }),
];
