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
    header: 'Taxonomía',
    cell: (props) => (
      <div className='w-96'>
        <strong>Filo:</strong> {phylumToString(props.getValue())}.
        <br />
        <strong>Reino:</strong> {kingdomToString(props.getValue().kingdom)}.
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
    cell: (props) => <ModalCrudClassTax id={Number(props.row.original.id)} />,
  }),
];
