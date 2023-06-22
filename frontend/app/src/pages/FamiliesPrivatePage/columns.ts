import { createColumnHelper } from '@tanstack/react-table';
import { Family } from '../../interfaces/FamilyInterface';

const columnHelper = createColumnHelper<Family>();

export const columns: any = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'Id',
  }),
  // Accessor Column
  columnHelper.accessor('name', {
    id: 'name',
    header: 'Nombre',
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
  }),
  // Accessor Column
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    header: 'Registrado',
  }),
  // Accessor Column
  columnHelper.accessor('updatedAt', {
    id: 'updatedAt',
    header: 'Última modificación',
  }),
  // Display Column
  columnHelper.display({
    id: 'acciones',
    header: 'Acciones',
    // cell: (props) => (
    //   <span>
    //     // <ModalCrudFamily objectId={props.row.original.id} />
    //   </span>
    // ),
  }),
];
