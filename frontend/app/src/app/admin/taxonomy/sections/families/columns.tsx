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
    cell: (props) => (<strong>{formatTitleCase(props.getValue())}</strong>),
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
    header: 'Taxonomía',
    cell: (props) => (
      <div className='w-96'>
        <strong>Orden:</strong> {orderTaxToString(props.getValue())}.
        <br />
        <strong>Clase:</strong> {classTaxToString(props.getValue().classTax)}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().classTax.phylum)}.
        {' - '}
        <strong>Reino:</strong> {kingdomToString(props.getValue().classTax.phylum.kingdom)}.
      </div>
    ),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.display({
    id: 'edit',
    header: 'Modificaciones',
    cell: (props) => (
      <div className='w-56'>
        <p><strong>Últ. act.: </strong>{formatDate(props.row.original.updatedAt)}</p>
        <p><strong>Creado: </strong>{formatDate(props.row.original.createdAt)}</p>
      </div>
    ),
  }),
  // Display Column
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: (props) => <ModalCrudFamily id={Number(props.row.original.id)} />,
  }),
];
