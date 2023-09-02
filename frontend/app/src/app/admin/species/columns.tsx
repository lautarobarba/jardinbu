import { createColumnHelper } from '@tanstack/react-table';
import { Species } from '@/interfaces/species.interface';
import { formatDate, formatTitleCase } from '@/utils/tools';
import { genusToString } from '@/interfaces/genus.interface';
import { familyToString } from '@/interfaces/family.interface';
import { orderTaxToString } from '@/interfaces/order-tax.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { ModalCrudSpecies } from './CrudSpeciesForm';

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
    // header: 'Género',
    // cell: (props) => genusToString(props.getValue()),
    header: 'Taxonomía',
    cell: (props) => (
      <>
        <strong>Género:</strong> {genusToString(props.getValue())}.
        <br />
        <strong>Familia:</strong> {familyToString(props.getValue().family)}.
        <br />
        <strong>Orden:</strong> {orderTaxToString(props.getValue().family.orderTax)}.
        <br />
        <strong>Clase:</strong> {classTaxToString(props.getValue().family.orderTax.classTax)}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().family.orderTax.classTax.phylum)}.
        <br />
        <strong>Reino:</strong> {kingdomToString(props.getValue().family.orderTax.classTax.phylum.kingdom)}.
      </>
    ),
    enableSorting: false,
  }),
  // // Accessor Column
  // columnHelper.accessor('genus', {
  //   id: 'family',
  //   header: 'Familia',
  //   cell: (props) => familyToString(props.getValue().family),
  //   enableSorting: false,
  // }),
  // // Accessor Column
  // columnHelper.accessor('genus', {
  //   id: 'orderTax',
  //   header: 'Orden',
  //   cell: (props) => orderTaxToString(props.getValue().family.orderTax),
  //   enableSorting: false,
  // }),
  // // Accessor Column
  // columnHelper.accessor('genus', {
  //   id: 'classTax',
  //   header: 'Clase',
  //   cell: (props) =>
  //     classTaxToString(props.getValue().family.orderTax.classTax),
  //   enableSorting: false,
  // }),
  // // Accessor Column
  // columnHelper.accessor('genus', {
  //   id: 'phylum',
  //   header: 'Filo',
  //   cell: (props) =>
  //     phylumToString(props.getValue().family.orderTax.classTax.phylum),
  //   enableSorting: false,
  // }),
  // // Accessor Column
  // columnHelper.accessor('genus', {
  //   id: 'kingdom',
  //   header: 'Reino',
  //   cell: (props) =>
  //     kingdomToString(props.getValue().family.orderTax.classTax.phylum.kingdom),
  //   enableSorting: false,
  // }),
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
