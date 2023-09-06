"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { Kingdom } from '@/interfaces/kingdom.interface';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { ModalCrudKingdom } from '../forms/CrudKingdomForm';

const columnHelper = createColumnHelper<Kingdom>();

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
    cell: (props) => <ModalCrudKingdom id={Number(props.row.original.id)} />,
  }),
];
