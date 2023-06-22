import { createColumnHelper } from '@tanstack/react-table';
import { Specimen } from '../../interfaces/SpecimenInterface';

const columnHelper = createColumnHelper<Specimen>();

export const columns: any = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'Id',
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
  }),
  // Accessor Column
  columnHelper.accessor('species', {
    id: 'species',
    header: 'Especie',
    cell: (props) =>
      `${props.getValue().commonName.toLowerCase()} (${props
        .getValue()
        .description.toLowerCase()})`,
  }),
  // Accessor Column
  columnHelper.accessor('species', {
    id: 'genus',
    header: 'Género',
    cell: (props) =>
      `${props.getValue().genus.name.toLowerCase()} (${props
        .getValue()
        .genus.description.toLowerCase()})`,
  }),
  // Accessor Column
  columnHelper.accessor('species', {
    id: 'family',
    header: 'Familia',
    cell: (props) =>
      `${props.getValue().genus.family.name.toLowerCase()} (${props
        .getValue()
        .genus.family.description.toLowerCase()})`,
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
