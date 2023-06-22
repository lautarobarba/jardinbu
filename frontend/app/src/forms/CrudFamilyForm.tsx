import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { Grid, TextField } from '@mui/material';
import { MDBBtn } from 'mdb-react-ui-kit';
import Axios from 'axios';
import { useCreateFamily } from '../api/hooks';
import { CreateFamilyDto } from '../interfaces/FamilyInterface';
import { useJwtToken } from '../features/auth/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Family } from '../interfaces/FamilyInterface';
import { PageSubTitle } from '../components/PageSubTitle';

interface IProps {
  toggleVisibility: Function;
}

export const CreateFamilyForm = (props: IProps) => {
  const { toggleVisibility } = props;
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Mutación
  const {
    mutate: createFamilyMutate,
    isLoading: createFamilyIsLoading,
    // isSuccess: createFamilyIsSuccess,
    // isError: createFamilyIsError,
    // error: createFamilyError,
  } = useCreateFamily();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo')
      .required('La familia necesita un nombre'),
    description: Yup.string()
      .min(2, 'Demasiado corto')
      .max(100, 'Demasiado largo'),
  });

  interface Values {
    name: string;
    description: string;
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createFamilyDto: CreateFamilyDto = {
        name: values.name,
        description: values.description,
      };

      createFamilyMutate(
        { token: token ?? '', createFamilyDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear una familia');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear una familia', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (family: Family) => {
            console.log('Familia creada correctamente');
            console.log(family);
            queryClient.invalidateQueries(['families']);
            toggleVisibility(false);
            enqueueSnackbar('Familia creada correctamente', {
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
          <PageSubTitle title='Registrar nueva familia' />
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
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          style={{ margin: '1rem' }}
          disabled={createFamilyIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createFamilyIsLoading}
        >
          {createFamilyIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};
