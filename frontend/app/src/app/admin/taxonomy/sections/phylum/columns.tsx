"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { Phylum } from '@/interfaces/phylum.interface';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { ModalCrudPhylum } from '../forms/CrudPhylumForm';

const columnHelper = createColumnHelper<Phylum>();

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
  columnHelper.accessor('kingdom', {
    id: 'kingdom',
    header: 'Taxonomía',
    cell: (props) => (
      <>
        <strong>Reino:</strong> {kingdomToString(props.getValue())}.
      </>
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
    cell: (props) => <ModalCrudPhylum id={Number(props.row.original.id)} />,
  }),
];
