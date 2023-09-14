"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { CustomChip } from '@/components/CustomChip';
import { Status, User } from '@/interfaces/user.interface';
import { ModalCrudUser } from './UpdateUserForm';

const columnHelper = createColumnHelper<User>();

export const columns = [
    // Accessor Column
    columnHelper.accessor('id', {
        header: 'ID',
    }),
    // Accessor Column
    columnHelper.accessor('lastname', {
        id: 'lastname',
        header: 'Apellido',
        cell: (props) => formatTitleCase(props.getValue()),
    }),
    // Accessor Column
    columnHelper.accessor('firstname', {
        id: 'firstname',
        header: 'Nombre',
        cell: (props) => formatTitleCase(props.getValue()),
    }),
    // Accessor Column
    columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
        cell: (props) => props.getValue(),
    }),
    // Accessor Column
    columnHelper.accessor('role', {
        id: 'role',
        header: 'Rol',
        cell: (props) => props.getValue(),
    }),
    // Accessor Column
    columnHelper.accessor('status', {
        id: 'status',
        header: 'Estado',
        cell: (props) => props.getValue() === Status.ACTIVE ? 'ACTIVO' : 'DESHABILITADO',
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
        cell: (props) => <ModalCrudUser id={Number(props.row.original.id)} />,
    }),
];
