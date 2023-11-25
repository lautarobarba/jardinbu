"use client";
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { QRCode } from '@/interfaces/qr-code.interface';
import { ModalCrudQRCode } from './CrudQRCodeForm';
import { ModalQRCodePrivateDetailView } from './QRCodePrivateDetailView';

const columnHelper = createColumnHelper<QRCode>();

export const columns = [
    // Accessor Column
    columnHelper.accessor('id', {
        header: 'ID',
    }),
    // Accessor Column
    columnHelper.accessor('title', {
        id: 'title',
        header: 'Título/Descripción',
        cell: (props) => formatTitleCase(props.getValue()),
    }),
    // Accessor Column
    columnHelper.accessor('link', {
        id: 'link',
        header: 'Link/Enlace',
        cell: (props) => (
            <a
                href={props.getValue()}
                style={{ color: 'blue' }}
                target="_blank"
            >
                {props.getValue()}
            </a>
        ),
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
        cell: (props) => (
            <span className='flex flex-row'>
                <ModalQRCodePrivateDetailView id={Number(props.row.original.id)} />
                <ModalCrudQRCode id={Number(props.row.original.id)} />
            </span>
        ),
    }),
];
