import { createColumnHelper } from '@tanstack/react-table';
import { Species } from '../../interfaces/SpeciesInterface';

const columnHelper = createColumnHelper<Species>();

export const columns: any = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'Id',
  }),
  // Accessor Column
  columnHelper.accessor('scientificName', {
    id: 'scientificName',
    header: 'Nombre científico',
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'genus',
    header: 'Género',
    cell: (props) =>
      `${props.getValue().name.toLowerCase()} (${props
        .getValue()
        .description.toLowerCase()})`,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'family',
    header: 'Familia',
    cell: (props) =>
      `${props.getValue().family.name.toLowerCase()} (${props
        .getValue()
        .family.description.toLowerCase()})`,
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
