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
    cell: (props) => (<strong>{formatTitleCase(props.getValue())}</strong>),
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
    header: 'Taxonomía',
    cell: (props) => (
      <div className='w-96'>
        <strong>Familia:</strong> {familyToString(props.getValue())}.
        {' - '}
        <strong>Orden:</strong> {orderTaxToString(props.getValue().orderTax)}.
        <br />
        <strong>Clase:</strong> {classTaxToString(props.getValue().orderTax.classTax)}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().orderTax.classTax.phylum)}.
        {' - '}
        <strong>Reino:</strong> {kingdomToString(props.getValue().orderTax.classTax.phylum.kingdom)}.
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
    cell: (props) => <ModalCrudGenus id={Number(props.row.original.id)} />,
  }),
];
