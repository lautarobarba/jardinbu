import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import {
  Alert,
  Autocomplete,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import {
  useCreatePhylum,
  useDeletePhylum,
  useGetKingdoms,
  useGetPhylum,
  useUpdatePhylum,
} from '@/services/hooks';
import {
  Phylum,
  CreatePhylumDto,
  UpdatePhylumDto,
} from '@/interfaces/phylum.interface';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { FormEvent, useState } from 'react';
import { Kingdom, kingdomToString } from '@/interfaces/kingdom.interface';
import { CreateKingdomForm } from './CrudKingdomForm';

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('El filo necesita un nombre'),
  description: Yup.string(),
  kingdom: Yup.object().required('Por favor seleccione un reino'),
});

interface Values {
  name: string;
  description: string;
  kingdom: any;
}

interface CreatePhylumFormProps {
  toggleVisibility: Function;
}

export const CreatePhylumForm = (props: CreatePhylumFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [openCreateKingdomModal, setOpenCreateKingdomModal] =
    useState<boolean>(false);

  const toggleOpenCreateKingdomModal = () => {
    setOpenCreateKingdomModal(!openCreateKingdomModal);
  };

  // Lista de reinos para Select
  const { isSuccess: getKingdomsIsSuccess, data: getKingdomsData } =
    useGetKingdoms({});

  // Mutación
  const {
    mutate: createPhylumMutate,
    isLoading: createPhylumIsLoading,
    // isSuccess: createPhylumIsSuccess,
    // isError: createPhylumIsError,
    // error: createPhylumError,
  } = useCreatePhylum();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      kingdom: {},
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createPhylumDto: CreatePhylumDto = {
        name: values.name,
        description: values.description,
        kingdomId: values.kingdom.id,
      };

      createPhylumMutate(
        { createPhylumDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear filo');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear filo', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (phylum: Phylum) => {
            console.log('Filo creado correctamente');
            console.log(phylum);
            queryClient.invalidateQueries(['phylums']);
            toggleVisibility(false);
            enqueueSnackbar('Filo creado correctamente', {
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
          <PageSubTitle title='Registrar nuevo filo' />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el filo puede agregar en Nombre: SIN
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
        <Grid item xs={11}>
          <Autocomplete
            id='kingdom'
            options={(getKingdomsData ?? []) as Kingdom[]}
            getOptionLabel={(kingdom: Kingdom) => kingdomToString(kingdom)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='kingdom'
                label='Reino'
                placeholder='Reino...'
                error={formik.touched.kingdom && Boolean(formik.errors.kingdom)}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Kingdom) =>
              formik.setFieldValue('kingdom', selection)
            }
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
              onClick={() => toggleOpenCreateKingdomModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateKingdomModal(false)}
            open={openCreateKingdomModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateKingdomForm
                toggleVisibility={toggleOpenCreateKingdomModal}
              />
            </div>
          </Dialog>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={createPhylumIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createPhylumIsLoading}
        >
          {createPhylumIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface UpdatePhylumFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdatePhylumForm = (props: UpdatePhylumFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [openCreateKingdomModal, setOpenCreateKingdomModal] =
    useState<boolean>(false);

  const toggleOpenCreateKingdomModal = () => {
    setOpenCreateKingdomModal(!openCreateKingdomModal);
  };

  // Lista de reinos para Select
  const { isSuccess: getKingdomsIsSuccess, data: getKingdomsData } =
    useGetKingdoms({});

  // Query
  const {
    // isLoading: getPhylumIsLoading,
    // isSuccess: getPhylumIsSuccess,
    data: getPhylumData,
    // isError: getPhylumIsError,
    // error: getPhylumError,
  } = useGetPhylum({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updatePhylumMutate,
    isLoading: updatePhylumIsLoading,
    // isSuccess: updatePhylumIsSuccess,
    // isError: updatePhylumIsError,
    // error: updatePhylumError,
  } = useUpdatePhylum();

  const formik = useFormik({
    initialValues: {
      name: getPhylumData?.name ?? '',
      description: getPhylumData?.description ?? '',
      kingdom: getPhylumData?.kingdom ?? {},
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updatePhylumDto: UpdatePhylumDto = {
        id: id,
        name: values.name,
        description: values.description,
        kingdomId: values.kingdom.id,
      };

      updatePhylumMutate(
        { updatePhylumDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar filo');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar filo', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (phylum: Phylum) => {
            console.log('Filo actualizado correctamente');
            console.log(phylum);
            queryClient.invalidateQueries(['phylums']);
            queryClient.invalidateQueries([`phylum-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Filo actualizado correctamente', {
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
          <PageSubTitle title={`Actualizar filo N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el filo puede agregar en Nombre: SIN
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
        <Grid item xs={11}>
          <Autocomplete
            id='kingdom'
            options={(getKingdomsData ?? []) as Kingdom[]}
            getOptionLabel={(kingdom: Kingdom) => kingdomToString(kingdom)}
            value={formik.values.kingdom as Kingdom}
            renderInput={(params) => (
              <TextField
                {...params}
                name='kingdom'
                label='Reino'
                placeholder='Reino...'
                error={formik.touched.kingdom && Boolean(formik.errors.kingdom)}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Kingdom) =>
              formik.setFieldValue('kingdom', selection)
            }
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
              onClick={() => toggleOpenCreateKingdomModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateKingdomModal(false)}
            open={openCreateKingdomModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateKingdomForm
                toggleVisibility={toggleOpenCreateKingdomModal}
              />
            </div>
          </Dialog>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={updatePhylumIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={updatePhylumIsLoading}
        >
          {updatePhylumIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface DeletePhylumFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeletePhylumForm = (props: DeletePhylumFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Query
  const {
    // isLoading: getPhylumIsLoading,
    // isSuccess: getPhylumIsSuccess,
    data: getPhylumData,
    // isError: getPhylumIsError,
    // error: getPhylumError,
  } = useGetPhylum({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deletePhylumMutate,
    isLoading: deletePhylumIsLoading,
    // isSuccess: deletePhylumIsSuccess,
    // isError: deletePhylumIsError,
    // error: deletePhylumError,
  } = useDeletePhylum();

  const deletePhylum = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deletePhylumMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar filo');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar filo', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Filo eliminado correctamente');
          queryClient.invalidateQueries(['phylums']);
          queryClient.invalidateQueries([`phylum-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Filo eliminado correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={(event) => deletePhylum(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar filo N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar un filo!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getPhylumData?.name ?? ''}
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
            value={getPhylumData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='kingdom'
            name='kingdom'
            label='Reino'
            value={
              getPhylumData?.kingdom
                ? kingdomToString(getPhylumData.kingdom)
                : ''
            }
            fullWidth
            autoComplete='kingdom'
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
          disabled={deletePhylumIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='danger'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deletePhylumIsLoading}
        >
          {deletePhylumIsLoading ? 'Eliminando...' : 'Eliminar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface ModalCrudPhylumProps {
  id: number;
}

export const ModalCrudPhylum = (props: ModalCrudPhylumProps) => {
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
            <UpdatePhylumForm toggleVisibility={setShowEditModal} id={id} />
          </div>
        </Dialog>
        <Dialog
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          maxWidth={'md'}
          fullWidth
        >
          <div className='p-5'>
            <DeletePhylumForm toggleVisibility={setShowDeleteModal} id={id} />
          </div>
        </Dialog>
      </div>
    </>
  );
};
