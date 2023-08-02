import { createColumnHelper } from '@tanstack/react-table';
import { Species } from '../../interfaces/SpeciesInterface';
import { formatDate, formatTitleCase } from '../../utils/tools';
import { genusToString } from '../../interfaces/GenusInterface';
import { familyToString } from '../../interfaces/FamilyInterface';
import { orderTaxToString } from '../../interfaces/OrderTaxInterface';
import { classTaxToString } from '../../interfaces/ClassTaxInterface';
import { phylumToString } from '../../interfaces/PhylumInterface';
import { kingdomToString } from '../../interfaces/KingdomInterface';
import { ModalCrudSpecies } from '../../forms/CrudSpeciesForm';

const columnHelper = createColumnHelper<Species>();

export const columns: any = [
  // Accessor Column
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  // Accessor Column
  columnHelper.accessor('scientificName', {
    id: 'scientificName',
    header: 'Nombre científico',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('commonName', {
    id: 'commonName',
    header: 'Nombre común',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('englishName', {
    id: 'englishName',
    header: 'Nombre en inglés',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('description', {
    id: 'description',
    header: 'Descripción',
    cell: (props) => formatTitleCase(props.getValue()),
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'genus',
    header: 'Género',
    cell: (props) => genusToString(props.getValue()),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'family',
    header: 'Familia',
    cell: (props) => familyToString(props.getValue().family),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'orderTax',
    header: 'Orden',
    cell: (props) => orderTaxToString(props.getValue().family.orderTax),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'classTax',
    header: 'Clase',
    cell: (props) =>
      classTaxToString(props.getValue().family.orderTax.classTax),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'phylum',
    header: 'Filo',
    cell: (props) =>
      phylumToString(props.getValue().family.orderTax.classTax.phylum),
    enableSorting: false,
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'kingdom',
    header: 'Reino',
    cell: (props) =>
      kingdomToString(props.getValue().family.orderTax.classTax.phylum.kingdom),
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
    cell: (props) => <ModalCrudSpecies id={Number(props.row.original.id)} />,
  }),
];
