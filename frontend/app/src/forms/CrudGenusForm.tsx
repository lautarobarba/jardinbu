import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { TextField, Grid, Autocomplete, Button, Dialog } from '@mui/material';
import { MDBBtn } from 'mdb-react-ui-kit';
import Axios from 'axios';
import { useCreateGenus, useGetFamilies } from '../api/hooks';
import { useJwtToken } from '../features/auth/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { CreateGenusDto, Genus } from '../interfaces/GenusInterface';
import { Family } from '../interfaces/FamilyInterface';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '../components/PageSubTitle';
import { useState } from 'react';
import { CreateFamilyForm } from './CrudFamilyForm';

interface Props {
  toggleVisibility: Function;
}

export const CreateGenusForm = (props: Props) => {
  const { toggleVisibility } = props;
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [openCreateFamilyModal, setOpenCreateFamilyModal] =
    useState<boolean>(false);

  const toggleOpenCreateFamilyModal = () => {
    setOpenCreateFamilyModal(!openCreateFamilyModal);
  };

  // Mutación
  const {
    mutate: createGenusMutate,
    isLoading: createGenusIsLoading,
    // isSuccess: createGenusIsSuccess,
    // isError: createGenusIsError,
    // error: createGenusError
  } = useCreateGenus();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo')
      .required('El género necesita un nombre'),
    description: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo'),
    familyId: Yup.number().required('Por favor seleccione una familia'),
  });

  interface Values {
    name: string;
    description: string;
    familyId: number;
  }

  // Lista de familias para Select
  const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
    useGetFamilies({});

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      familyId: 0,
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createGenusDto: CreateGenusDto = {
        name: values.name,
        description: values.description,
        familyId: values.familyId,
      };

      createGenusMutate(
        { token: token ?? '', createGenusDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear un género');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear un género', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (genus: Genus) => {
            console.log('Género creado correctamente');
            console.log(genus);
            queryClient.invalidateQueries(['genera']);
            toggleVisibility(false);
            enqueueSnackbar('Género creado correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  // Formateo para select
  const getFamiliesForSelect = () => {
    if (getFamiliesData) {
      return getFamiliesData?.rows.map((family: Family) => {
        return {
          value: family.id,
          label: `${family.name}`,
        };
      });
    } else {
      return [];
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title='Registrar nuevo género' />
        </Grid>

        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={8}>
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
            id='familyId'
            selectOnFocus={true}
            clearOnBlur={true}
            options={getFamiliesForSelect()}
            fullWidth
            renderInput={(params) => (
              <TextField
                name='familyId'
                label='Familia'
                value={formik.values.familyId}
                error={
                  formik.touched.familyId && Boolean(formik.errors.familyId)
                }
                helperText={formik.touched.familyId && formik.errors.familyId}
                {...params}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection) =>
              formik.setFieldValue('familyId', selection?.value)
            }
            disableClearable={true}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ height: '100%' }}
            onClick={() => setOpenCreateFamilyModal(true)}
          >
            <i className='fas fa-plus fa-2x'></i>
          </Button>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          style={{ margin: '1rem' }}
          disabled={createGenusIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createGenusIsLoading}
        >
          {createGenusIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>

      <Dialog
        onClose={() => setOpenCreateFamilyModal(false)}
        open={openCreateFamilyModal}
        maxWidth={'md'}
        fullWidth
      >
        <div className='p-5'>
          <CreateFamilyForm toggleVisibility={toggleOpenCreateFamilyModal} />
        </div>
      </Dialog>
    </form>
  );
};
