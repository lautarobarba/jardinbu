import { createColumnHelper } from '@tanstack/react-table';
import { Species } from '@/interfaces/species.interface';
import { formatDate, formatTitleCase, getUrlForImageById } from '@/utils/tools';
import { genusToString } from '@/interfaces/genus.interface';
import { familyToString } from '@/interfaces/family.interface';
import { orderTaxToString } from '@/interfaces/order-tax.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { ModalCrudSpecies } from './CrudSpeciesForm';
import { Image } from '@/interfaces/image.interface';

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
    cell: (props) => (<strong>{formatTitleCase(props.getValue())}</strong>),
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
  // Accessor Column
  columnHelper.accessor('exampleImg', {
    id: 'exampleImg',
    header: 'Imágen',
    cell: (props) => {
      const image: Image | undefined = props.getValue();
      if (image)
        return (
          <>
            {props.getValue() && (
              <img
                loading='lazy'
                src={getUrlForImageById(image.id)}
                alt="Logo JBU"
                title="Logo JBU"
                width={100}
              />
            )}
          </>
        );
      else return "";
    },
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
