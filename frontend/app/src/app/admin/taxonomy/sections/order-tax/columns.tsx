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
    header: 'Taxonomía',
    cell: (props) => (
      <div className='w-96'>
        <strong>Clase:</strong> {classTaxToString(props.getValue())}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().phylum)}.
        {' - '}
        <strong>Reino:</strong> {kingdomToString(props.getValue().phylum.kingdom)}.
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
    cell: (props) => <ModalCrudOrderTax id={Number(props.row.original.id)} />,
  }),
];
