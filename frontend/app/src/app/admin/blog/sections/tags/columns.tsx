"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { Tag } from '@/interfaces/tag.interface';
import { formatDate } from '@/utils/tools';
import { CustomChip } from '@/components/CustomChip';
import { ModalCrudTag } from './CrudTagForm';

const columnHelper = createColumnHelper<Tag>();

export const columns = [
    // Accessor Column
    columnHelper.accessor('id', {
        header: 'ID',
    }),
    // Accessor Column
    columnHelper.accessor('name', {
        id: 'name',
        header: 'Nombre',
        cell: (props) => (<CustomChip tag={props.row.original} />),
    }),
    // Accessor Column
    columnHelper.accessor('bgColor', {
        id: 'bgColor',
        header: 'Color',
        cell: (props) => (<CustomChip tag={{ ...props.row.original, name: '' }} />),
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
        cell: (props) => <ModalCrudTag id={Number(props.row.original.id)} />,
    }),
];
