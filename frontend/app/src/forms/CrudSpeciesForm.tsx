import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import {
  TextField,
  Grid,
  Autocomplete,
  Dialog,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useCreateSpecies, useGetGenera } from '../api/hooks';
import { useJwtToken } from '../features/auth/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { Genus, genusToString } from '../interfaces/GenusInterface';
import {
  CreateSpeciesDto,
  FoliageType,
  OrganismType,
  Presence,
  Species,
  Status,
} from '../interfaces/SpeciesInterface';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '../components/PageSubTitle';
import { useState } from 'react';
import { CreateGenusForm } from './CrudGenusForm';
import { formatTitleCase } from '../utils/tools';

const ValidationSchema = Yup.object().shape({
  scientificName: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('La especie necesita un nombre científico'),
  commonName: Yup.string(),
  englishName: Yup.string(),
  description: Yup.string(),
  genus: Yup.object().required('Por favor seleccione un género'),
  organismType: Yup.string().required(
    'Por favor seleccione un tipo de organismo'
  ),
  status: Yup.string().required('Por favor seleccione un status'),
  foliageType: Yup.string().required('Por favor seleccione un tipo de follage'),
  presence: Yup.string().required(
    'Por favor seleccione el estado de presencia'
  ),
});

interface Values {
  scientificName: string;
  commonName: string;
  englishName: string;
  description: string;
  genus: any;
  organismType: string;
  status: string;
  foliageType: string;
  presence: string;
}

interface CreateSpeciesFormProps {
  toggleVisibility: Function;
}

export const CreateSpeciesForm = (props: CreateSpeciesFormProps) => {
  const { toggleVisibility } = props;
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [family, setFamily] = useState<string>('');
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateGenusModal, setOpenCreateGenusModal] =
    useState<boolean>(false);

  const toggleOpenCreateGenusModal = () => {
    setOpenCreateGenusModal(!openCreateGenusModal);
  };

  // Lista de géneros para Select
  const { isSuccess: getGeneraIsSuccess, data: getGeneraData } = useGetGenera(
    {}
  );

  // Mutación
  const {
    mutate: createSpeciesMutate,
    isLoading: createSpeciesIsLoading,
    // isSuccess: createSpeciesIsSuccess,
    // isError: createSpeciesIsError,
    // error: createSpeciesError
  } = useCreateSpecies();

  const formik = useFormik({
    initialValues: {
      scientificName: '',
      commonName: '',
      englishName: '',
      description: '',
      genus: {},
      organismType: '',
      status: '',
      foliageType: '',
      presence: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createSpeciesDto: CreateSpeciesDto = {
        scientificName: values.scientificName,
        commonName: values.commonName,
        englishName: values.englishName,
        description: values.description,
        genusId: values.genus.id,
        organismType: values.organismType as OrganismType,
        status: values.status as Status,
        foliageType: values.foliageType as FoliageType,
        presence: values.presence as Presence,
      };

      createSpeciesMutate(
        { token: token ?? '', createSpeciesDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear especie');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear especie', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (species: Species) => {
            console.log('Especie creada correctamente');
            console.log(species);
            queryClient.invalidateQueries(['species']);
            toggleVisibility(false);
            enqueueSnackbar('Especie creada correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title='Registrar nueva especie' />
        </Grid>

        <Grid item xs={11}>
          <Autocomplete
            id='genus'
            options={(getGeneraData ?? []) as Genus[]}
            getOptionLabel={(genus: Genus) => genusToString(genus)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='genus'
                label='Género'
                placeholder='Género...'
                error={formik.touched.genus && Boolean(formik.errors.genus)}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Genus) => {
              formik.setFieldValue('genus', selection);
              formik.setFieldValue(
                'scientificName',
                `${formatTitleCase(selection.name)} `
              );
              setFamily(selection?.family.name ?? '');
              setOrderTax(selection?.family.orderTax.name ?? '');
              setClassTax(selection?.family.orderTax.classTax.name ?? '');
              setPhylum(selection?.family.orderTax.classTax.phylum.name ?? '');
              setKingdom(
                selection?.family.orderTax.classTax.phylum.kingdom.name ?? ''
              );
            }}
            fullWidth
            disableClearable={true}
            autoSelect={true}
          />
        </Grid>
        <Grid
          container
          item
          xs={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Tooltip title='Nuevo' arrow>
            <IconButton
              type='button'
              onClick={() => toggleOpenCreateGenusModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateGenusModal(false)}
            open={openCreateGenusModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateGenusForm toggleVisibility={toggleOpenCreateGenusModal} />
            </div>
          </Dialog>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Familia'
            label='Familia'
            fullWidth
            value={family}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='scientificName'
            name='scientificName'
            label='Nombre científico'
            value={formik.values.scientificName}
            onChange={formik.handleChange}
            error={
              formik.touched.scientificName &&
              Boolean(formik.errors.scientificName)
            }
            helperText={
              formik.touched.scientificName && formik.errors.scientificName
            }
            fullWidth
            required
            autoComplete='scientificName'
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='commonName'
            name='commonName'
            label='Nombre común'
            value={formik.values.commonName}
            onChange={formik.handleChange}
            error={
              formik.touched.commonName && Boolean(formik.errors.commonName)
            }
            helperText={formik.touched.commonName && formik.errors.commonName}
            fullWidth
            autoComplete='commonName'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='englishName'
            name='englishName'
            label='Nombre en inglés'
            value={formik.values.englishName}
            onChange={formik.handleChange}
            error={
              formik.touched.englishName && Boolean(formik.errors.englishName)
            }
            helperText={formik.touched.englishName && formik.errors.englishName}
            fullWidth
            autoComplete='englishName'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='description'
            name='description'
            label='Descripción'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            autoComplete='description'
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo de organismo</InputLabel>
            <Select
              id='organismType'
              name='organismType'
              label='Tipo de organismo'
              value={formik.values.organismType}
              onChange={formik.handleChange}
              error={
                formik.touched.organismType &&
                Boolean(formik.errors.organismType)
              }
              fullWidth
              autoComplete='organismType'
              required
            >
              <MenuItem key={0} value={'TREE'}>
                ARBOL
              </MenuItem>
              <MenuItem key={1} value={'BUSH'}>
                ARBUSTO
              </MenuItem>
              <MenuItem key={2} value={'SUBSHRUB'}>
                SUBARBUSTO
              </MenuItem>
              <MenuItem key={3} value={'FUNGUS'}>
                HONGO
              </MenuItem>
              <MenuItem key={4} value={'GRASS'}>
                HIERBA
              </MenuItem>
              <MenuItem key={5} value={'LICHEN'}>
                LIQUEN
              </MenuItem>
              <MenuItem key={6} value={'HEMIPARASITE_SUBSHRUB'}>
                SUBARBUSTO HEMIPARÁSITO
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo de follage</InputLabel>
            <Select
              id='foliageType'
              name='foliageType'
              label='Tipo de follage'
              value={formik.values.foliageType}
              onChange={formik.handleChange}
              error={
                formik.touched.foliageType && Boolean(formik.errors.foliageType)
              }
              fullWidth
              autoComplete='foliageType'
              required
            >
              <MenuItem key={0} value={'PERENNIAL'}>
                PERENNE
              </MenuItem>
              <MenuItem key={1} value={'DECIDUOUS'}>
                CADUCIFOLIA
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              id='status'
              name='status'
              label='Status'
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              fullWidth
              autoComplete='status'
              required
            >
              <MenuItem key={0} value={'NATIVE'}>
                NATIVA
              </MenuItem>
              <MenuItem key={1} value={'ENDEMIC'}>
                ENDEMICA
              </MenuItem>
              <MenuItem key={2} value={'INTRODUCED'}>
                INTRODUCIDA
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Presencia</InputLabel>
            <Select
              id='presence'
              name='presence'
              label='Presencia'
              value={formik.values.presence}
              onChange={formik.handleChange}
              error={formik.touched.presence && Boolean(formik.errors.presence)}
              fullWidth
              autoComplete='presence'
              required
            >
              <MenuItem key={0} value={'PRESENT'}>
                PRESENTE
              </MenuItem>
              <MenuItem key={1} value={'ABSENT'}>
                AUSENTE
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={createSpeciesIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createSpeciesIsLoading}
        >
          {createSpeciesIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};
