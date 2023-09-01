"use client";
import { FormEvent, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip } from '@nextui-org/react';
import { Alert, Grid, TextField } from '@mui/material';
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
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { PencilIcon, TrashIcon } from 'lucide-react';


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
    <form onSubmit={formik.handleSubmit} >
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
        <Button
          color='danger'
          radius="sm"
          className="uppercase text-white"
          type='button'
          style={{ margin: '1rem' }}
          disabled={createKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </Button>
        <Button
          color='success'
          radius="sm"
          className="uppercase text-white"
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createKingdomIsLoading}
        >
          {createKingdomIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    data: getKingdomData,
  } = useGetKingdom({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateKingdomMutate,
    isLoading: updateKingdomIsLoading,
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
        <Button
          color='danger'
          radius="sm"
          className="uppercase"
          type='button'
          style={{ margin: '1rem' }}
          disabled={updateKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </Button>
        <Button
          color='success'
          radius="sm"
          className="uppercase"
          type='submit'
          style={{ margin: '1rem' }}
          disabled={updateKingdomIsLoading}
        >
          {updateKingdomIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    data: getKingdomData,
  } = useGetKingdom({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteKingdomMutate,
    isLoading: deleteKingdomIsLoading,
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
        <Button
          color='success'
          radius="sm"
          className="uppercase"
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteKingdomIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </Button>
        <Button
          color='danger'
          radius="sm"
          className="uppercase"
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deleteKingdomIsLoading}
        >
          {deleteKingdomIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
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
      <div className='flex flex-row space-x-2'>
        <Tooltip content="Editar">
          <span
            onClick={() => setShowEditModal(true)}
          >
            <PencilIcon className='text-primary' />
          </span>
        </Tooltip>
        <Tooltip content="Eliminar">
          <span
            onClick={() => setShowDeleteModal(true)}
          >
            <TrashIcon className='text-error' />
          </span>
        </Tooltip>
      </div>
      <div>
        <Modal
          size="5xl"
          radius="sm"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          isDismissable={false}
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <UpdateKingdomForm toggleVisibility={setShowEditModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
        <Modal
          size="5xl"
          radius="sm"
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          isDismissable={false}
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <DeleteKingdomForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div >
    </>
  );
};
