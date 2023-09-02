"use client";
import { FormEvent, HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip } from '@nextui-org/react';
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import {
  TextField,
  Grid,
  Autocomplete,
  Alert,
} from '@mui/material';
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
import { Kingdom, kingdomToString } from '@/interfaces/kingdom.interface';
import { CreateKingdomForm } from './CrudKingdomForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';


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
            renderOption={(props: HTMLAttributes<HTMLLIElement>, kingdom: Kingdom) => {
              return (
                <li {...props} key={kingdom.id}>
                  {kingdomToString(kingdom)}
                </li>
              );
            }}
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateKingdomModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateKingdomModal}
            onClose={() => setOpenCreateKingdomModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateKingdomForm
                    toggleVisibility={toggleOpenCreateKingdomModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={createPhylumIsLoading}
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
          disabled={createPhylumIsLoading}
        >
          {createPhylumIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    data: getPhylumData,
  } = useGetPhylum({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updatePhylumMutate,
    isLoading: updatePhylumIsLoading,
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
            renderOption={(props: HTMLAttributes<HTMLLIElement>, kingdom: Kingdom) => {
              return (
                <li {...props} key={kingdom.id}>
                  {kingdomToString(kingdom)}
                </li>
              );
            }}
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateKingdomModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateKingdomModal}
            onClose={() => setOpenCreateKingdomModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateKingdomForm
                    toggleVisibility={toggleOpenCreateKingdomModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={updatePhylumIsLoading}
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
          disabled={updatePhylumIsLoading}
        >
          {updatePhylumIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    data: getPhylumData,
  } = useGetPhylum({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deletePhylumMutate,
    isLoading: deletePhylumIsLoading,
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
        <Button
          color='success'
          radius="sm"
          className="uppercase text-white"
          type='button'
          style={{ margin: '1rem' }}
          disabled={deletePhylumIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </Button>
        <Button
          color='danger'
          radius="sm"
          className="uppercase text-white"
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deletePhylumIsLoading}
        >
          {deletePhylumIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
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
                <UpdatePhylumForm toggleVisibility={setShowEditModal} id={id} />
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
                <DeletePhylumForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
