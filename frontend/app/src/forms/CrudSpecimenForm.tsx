import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import {
  Select,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Autocomplete,
  Button,
  Dialog,
} from '@mui/material';
import { MDBBtn } from 'mdb-react-ui-kit';
import Axios from 'axios';
import {
  useCreateSpecies,
  useCreateSpecimen,
  useGetFamilies,
  useGetGenera,
  useGetSpecies,
} from '../api/hooks';
import { useJwtToken } from '../features/auth/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { Family } from '../interfaces/FamilyInterface';
import { Genus } from '../interfaces/GenusInterface';
import {
  CreateSpeciesDto,
  FoliageType,
  Origin,
  Species,
  Status,
} from '../interfaces/SpeciesInterface';
import { useSnackbar } from 'notistack';
import { CreateSpecimenDto, Specimen } from '../interfaces/SpecimenInterface';
import { PageSubTitle } from '../components/PageSubTitle';
import { useEffect, useState } from 'react';
import { CreateSpeciesForm } from './CrudSpeciesForm';

interface Props {
  toggleVisibility: Function;
}

export const CreateSpecimenForm = (props: Props) => {
  const { toggleVisibility } = props;
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [genero, setGenero] = useState<string>('');
  const [familia, setFamilia] = useState<string>('');

  const [openCreateSpeciesModal, setOpenCreateSpeciesModal] =
    useState<boolean>(false);

  const toggleOpenCreateSpeciesModal = () => {
    setOpenCreateSpeciesModal(!openCreateSpeciesModal);
  };

  // Mutación
  const {
    mutate: createSpecimenMutate,
    isLoading: createSpecimenIsLoading,
    isSuccess: createSpecimenIsSuccess,
    // isError: createSpecimenIsError,
    // error: createSpecimenError
  } = useCreateSpecimen();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo')
      .required('El ejemplar necesita un nombre'),
    description: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo'),
    speciesId: Yup.number().required('Por favor seleccione una especie'),
    coordLat: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo'),
    coordLon: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo'),
  });

  interface Values {
    name: string;
    description: string;
    speciesId: number;
    coordLat: string;
    coordLon: string;
  }

  // Lista de especies para select
  const { isSuccess: getSpeciesIsSuccess, data: getSpeciesData } =
    useGetSpecies({});

  // Lista de géneros para select
  const { isSuccess: getGeneraIsSuccess, data: getGeneraData } = useGetGenera(
    {}
  );

  // Lista de familias para Select
  const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
    useGetFamilies({});

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      speciesId: 0,
      coordLat: '',
      coordLon: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: any, { setErrors }: FormikHelpers<any>) => {
      const createSpecimenDto: CreateSpecimenDto = {
        name: values.name,
        description: values.description,
        speciesId: values.speciesId,
        coordLat: values.coordLat,
        coordLon: values.coordLon,
      };

      createSpecimenMutate(
        { token: token ?? '', createSpecimenDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear un ejemplar');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear un ejemplar', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (specimen: Specimen) => {
            console.log('Ejemplar creado correctamente');
            console.log(specimen);
            queryClient.invalidateQueries(['specimens']);
            toggleVisibility(false);
            enqueueSnackbar('Ejemplar creado correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  // Formateo para select
  const getSpeciesForSelect = () => {
    if (getSpeciesData) {
      return getSpeciesData?.rows.map((species: Species) => {
        return {
          value: species.id,
          label: `${species.scientificName} (${species.commonName})`,
        };
      });
    } else {
      return [];
    }
  };

  // Actualizo el género y la familia al cambiar de especie
  useEffect(() => {
    if (formik.values.speciesId) {
      const speciesSelected: Species | undefined = getSpeciesData?.rows.filter(
        (species) => species.id === formik.values.speciesId
      )[0];
      setGenero(speciesSelected?.genus.name ?? '');
      setFamilia(speciesSelected?.genus.family.name ?? '');
    }
  }, [formik.values.speciesId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title='Registrar nuevo ejemplar' />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            required
            autoComplete='name'
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
            autoFocus
          />
        </Grid>

        <Grid item xs={11}>
          <Autocomplete
            id='speciesId'
            selectOnFocus={true}
            clearOnBlur={true}
            options={getSpeciesForSelect()}
            fullWidth
            renderInput={(params) => (
              <TextField
                name='speciesId'
                label='Especie'
                value={formik.values.speciesId}
                error={
                  formik.touched.speciesId && Boolean(formik.errors.speciesId)
                }
                helperText={formik.touched.speciesId && formik.errors.speciesId}
                {...params}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection) => {
              formik.setFieldValue('speciesId', selection?.value);
            }}
            disableClearable={true}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ height: '100%' }}
            onClick={() => setOpenCreateSpeciesModal(true)}
          >
            <i className='fas fa-plus fa-2x'></i>
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Género'
            label='Género'
            fullWidth
            value={genero}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Familia'
            label='Familia'
            fullWidth
            value={familia}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='coordLat'
            name='coordLat'
            label='Coord. Latitud'
            value={formik.values.coordLat}
            onChange={formik.handleChange}
            error={formik.touched.coordLat && Boolean(formik.errors.coordLat)}
            helperText={formik.touched.coordLat && formik.errors.coordLat}
            fullWidth
            autoComplete='coordLat'
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='coordLon'
            name='coordLon'
            label='Coord. Longitud'
            value={formik.values.coordLon}
            onChange={formik.handleChange}
            error={formik.touched.coordLon && Boolean(formik.errors.coordLon)}
            helperText={formik.touched.coordLon && formik.errors.coordLon}
            fullWidth
            autoComplete='coordLon'
            autoFocus
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          style={{ margin: '1rem' }}
          disabled={createSpecimenIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createSpecimenIsLoading}
        >
          {createSpecimenIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>

      <Dialog
        onClose={() => setOpenCreateSpeciesModal(false)}
        open={openCreateSpeciesModal}
        maxWidth={'md'}
        fullWidth
      >
        <div className='p-5'>
          <CreateSpeciesForm toggleVisibility={toggleOpenCreateSpeciesModal} />
        </div>
      </Dialog>
    </form>
  );
};
