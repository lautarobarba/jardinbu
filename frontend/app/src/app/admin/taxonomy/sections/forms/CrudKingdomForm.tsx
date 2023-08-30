"use client";
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { Alert, Dialog, Grid, TextField } from '@mui/material';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import {
  useCreateKingdom,
  useDeleteKingdom,
  useGetKingdom,
  useUpdateKingdom,
} from '@/services/hooks';
import {
  Kingdom,
  CreateKingdomDto,
  UpdateKingdomDto,
} from '@/interfaces/kingdom.interface';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { FormEvent, useState } from 'react';

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('El reino necesita un nombre'),
  description: Yup.string(),
});

interface Values {
  name: string;
  description: string;
}

interface CreateKingdomFormProps {
  toggleVisibility: Function;
}

export const CreateKingdomForm = (props: CreateKingdomFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Mutación
  const {
    mutate: createKingdomMutate,
    isLoading: createKingdomIsLoading,
    // isSuccess: createKingdomIsSuccess,
    // isError: createKingdomIsError,
    // error: createKingdomError,
  } = useCreateKingdom();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createKingdomDto: CreateKingdomDto = {
        name: values.name,
        description: values.description,
      };

      createKingdomMutate(
        { createKingdomDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear reino');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear reino', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (kingdom: Kingdom) => {
            console.log('Reino creado correctamente');
            console.log(kingdom);
            queryClient.invalidateQueries(['kingdoms']);
            toggleVisibility(false);
            enqueueSnackbar('Reino creado correctamente', {
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
          <PageSubTitle title='Registrar nuevo reino' />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el reino puede agregar en Nombre: SIN
            DEFINIR
          </Alert>
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
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={createKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createKingdomIsLoading}
        >
          {createKingdomIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface UpdateKingdomFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateKingdomForm = (props: UpdateKingdomFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Query
  const {
    // isLoading: getKingdomIsLoading,
    // isSuccess: getKingdomIsSuccess,
    data: getKingdomData,
    // isError: getKingdomIsError,
    // error: getKingdomError,
  } = useGetKingdom({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateKingdomMutate,
    isLoading: updateKingdomIsLoading,
    // isSuccess: updateKingdomIsSuccess,
    // isError: updateKingdomIsError,
    // error: updateKingdomError,
  } = useUpdateKingdom();

  const formik = useFormik({
    initialValues: {
      name: getKingdomData?.name ?? '',
      description: getKingdomData?.description ?? '',
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateKingdomDto: UpdateKingdomDto = {
        id: id,
        name: values.name,
        description: values.description,
      };

      updateKingdomMutate(
        { updateKingdomDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar reino');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar reino', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (kingdom: Kingdom) => {
            console.log('Reino actualizado correctamente');
            console.log(kingdom);
            queryClient.invalidateQueries(['kingdoms']);
            queryClient.invalidateQueries([`kingdom-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Reino actualizado correctamente', {
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
          <PageSubTitle title={`Actualizar reino N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el reino puede agregar en Nombre: SIN
            DEFINIR
          </Alert>
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
          type='button'
          style={{ margin: '1rem' }}
          disabled={updateKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={updateKingdomIsLoading}
        >
          {updateKingdomIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface DeleteKingdomFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteKingdomForm = (props: DeleteKingdomFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Query
  const {
    // isLoading: getKingdomIsLoading,
    // isSuccess: getKingdomIsSuccess,
    data: getKingdomData,
    // isError: getKingdomIsError,
    // error: getKingdomError,
  } = useGetKingdom({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteKingdomMutate,
    isLoading: deleteKingdomIsLoading,
    // isSuccess: deleteKingdomIsSuccess,
    // isError: deleteKingdomIsError,
    // error: deleteKingdomError,
  } = useDeleteKingdom();

  const deleteKingdom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteKingdomMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar reino');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar reino', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Reino eliminado correctamente');
          queryClient.invalidateQueries(['kingdoms']);
          queryClient.invalidateQueries([`kingdom-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Reino eliminado correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={(event) => deleteKingdom(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar reino N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar un reino!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getKingdomData?.name ?? ''}
            fullWidth
            required
            autoComplete='name'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id='description'
            name='description'
            label='Descripción'
            value={getKingdomData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='primary'
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='danger'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deleteKingdomIsLoading}
        >
          {deleteKingdomIsLoading ? 'Eliminando...' : 'Eliminar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface ModalCrudKingdomProps {
  id: number;
}

export const ModalCrudKingdom = (props: ModalCrudKingdomProps) => {
  const { id } = props;
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  return (
    <>
      <div>
        <MDBIcon
          icon='pencil-alt'
          size='lg'
          className='d-inline mx-2 text-dark'
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          onClick={() => setShowEditModal(true)}
        />
        <MDBIcon
          icon='trash-alt'
          size='lg'
          className='d-inline mx-2 text-danger'
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          onClick={() => setShowDeleteModal(true)}
        />
      </div>
      <div>
        <Dialog
          onClose={() => setShowEditModal(false)}
          open={showEditModal}
          maxWidth={'md'}
          fullWidth
        >
          <div className='p-5'>
            <UpdateKingdomForm toggleVisibility={setShowEditModal} id={id} />
          </div>
        </Dialog>
        <Dialog
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          maxWidth={'md'}
          fullWidth
        >
          <div className='p-5'>
            <DeleteKingdomForm toggleVisibility={setShowDeleteModal} id={id} />
          </div>
        </Dialog>
      </div>
    </>
  );
};
