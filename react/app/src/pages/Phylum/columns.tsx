import { createColumnHelper } from '@tanstack/react-table';
import { Phylum } from '../../interfaces/PhylumInterface';
import { formatDate, formatTitleCase } from '../../utils/tools';
import { ModalCrudPhylum } from '../../forms/CrudPhylumForm';
import { kingdomToString } from '../../interfaces/KingdomInterface';

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
    cell: (props) => formatTitleCase(props.getValue()),
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
    header: 'Reino',
    cell: (props) => kingdomToString(props.getValue()),
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
    cell: (props) => <ModalCrudPhylum id={Number(props.row.original.id)} />,
  }),
];
