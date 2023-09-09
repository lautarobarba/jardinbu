import { createColumnHelper } from '@tanstack/react-table';
import { OrganismType, Species } from '@/interfaces/species.interface';
import { formatDate, formatTitleCase, getUrlForImageById, getUrlForImageByUUID } from '@/utils/tools';
import { genusToString } from '@/interfaces/genus.interface';
import { familyToString } from '@/interfaces/family.interface';
import { orderTaxToString } from '@/interfaces/order-tax.interface';
import { classTaxToString } from '@/interfaces/class-tax.interface';
import { phylumToString } from '@/interfaces/phylum.interface';
import { kingdomToString } from '@/interfaces/kingdom.interface';
import { ModalCrudSpecies } from './CrudSpeciesForm';
import { Image } from '@/interfaces/image.interface';
import { ModalSpeciesPrivateDetailView } from './SpeciesPrivateDetailView';

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
  columnHelper.accessor('organismType', {
    id: 'organismType',
    header: 'Tipo de organismo',
    cell: (props) => {
      switch (props.getValue()) {
        case OrganismType.TREE: return <span>ÁRBOL</span>
        case OrganismType.BUSH: return <span>ARBUSTO</span>
        case OrganismType.SUBSHRUB: return <span>SUBARBUSTO</span>
        case OrganismType.FUNGUS: return <span>HONGO</span>
        case OrganismType.GRASS: return <span>HIERBA</span>
        case OrganismType.LICHEN: return <span>LIQUEN</span>
        case OrganismType.HEMIPARASITE_SUBSHRUB: return <span>SUBARBUSTO HEMIPARÁSITO</span>
        default: return <span>Error</span>
      }
    },
  }),
  // Accessor Column
  columnHelper.accessor('genus', {
    id: 'genus',
    header: 'Taxonomía',
    cell: (props) => (
      <div className='w-96'>
        <strong>Género:</strong> {genusToString(props.getValue())}.
        {' - '}
        <strong>Familia:</strong> {familyToString(props.getValue().family)}.
        <br />
        <strong>Orden:</strong> {orderTaxToString(props.getValue().family.orderTax)}.
        {' - '}
        <strong>Clase:</strong> {classTaxToString(props.getValue().family.orderTax.classTax)}.
        <br />
        <strong>Filo:</strong> {phylumToString(props.getValue().family.orderTax.classTax.phylum)}.
        {' - '}
        <strong>Reino:</strong> {kingdomToString(props.getValue().family.orderTax.classTax.phylum.kingdom)}.
      </div>
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
                src={getUrlForImageByUUID(image.uuid)}
                alt={image.originalName}
                title={image.originalName}
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
    cell: (props) =>
      <span className='flex flex-row'>
        <ModalSpeciesPrivateDetailView id={Number(props.row.original.id)} />
        <ModalCrudSpecies id={Number(props.row.original.id)} />
      </span>
  }),
];
