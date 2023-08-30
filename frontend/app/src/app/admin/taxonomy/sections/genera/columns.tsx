"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { orderTaxToString } from '@/interfaces/order-tax.interface';
import { Genus } from '@/interfaces/genus.interface';
import { familyToString } from '@/interfaces/family.interface';
import { ModalCrudGenus } from '../forms/CrudGenusForm';

const columnHelper = createColumnHelper<Genus>();

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
  columnHelper.accessor('family', {
    id: 'family',
    header: 'Familia',
    cell: (props) => familyToString(props.getValue()),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('family', {
    id: 'orderTax',
    header: 'Orden',
    cell: (props) => orderTaxToString(props.getValue().orderTax),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('family', {
    id: 'classTax',
    header: 'Clase',
    cell: (props) => classTaxToString(props.getValue().orderTax.classTax),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('family', {
    id: 'phylum',
    header: 'Filo',
    cell: (props) => phylumToString(props.getValue().orderTax.classTax.phylum),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('family', {
    id: 'kingdom',
    header: 'Reino',
    cell: (props) =>
      kingdomToString(props.getValue().orderTax.classTax.phylum.kingdom),
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
    cell: (props) => <ModalCrudGenus id={Number(props.row.original.id)} />,
  }),
];
