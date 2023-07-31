import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatTitleCase } from '../../utils/tools';
import { kingdomToString } from '../../interfaces/KingdomInterface';
import { phylumToString } from '../../interfaces/PhylumInterface';
import { ModalCrudClassTax } from '../../forms/CrudClassTaxForm';
import { OrderTax } from '../../interfaces/OrderTaxInterface';
import { classTaxToString } from '../../interfaces/ClassTaxInterface';
import { ModalCrudOrderTax } from '../../forms/CrudOrderTaxForm';

const columnHelper = createColumnHelper<OrderTax>();

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
  columnHelper.accessor('classTax', {
    id: 'classTax',
    header: 'Clase',
    cell: (props) => classTaxToString(props.getValue()),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('classTax', {
    id: 'phylum',
    header: 'Filo',
    cell: (props) => phylumToString(props.getValue().phylum),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('classTax', {
    id: 'kingdom',
    header: 'Reino',
    cell: (props) => kingdomToString(props.getValue().phylum.kingdom),
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
    cell: (props) => <ModalCrudOrderTax id={Number(props.row.original.id)} />,
  }),
];
