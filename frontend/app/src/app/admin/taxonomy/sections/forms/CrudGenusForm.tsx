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
  useCreateGenus,
  useDeleteGenus,
  useGetFamilies,
  useGetGenus,
  useUpdateGenus,
} from '@/services/hooks';
import {
  CreateGenusDto,
  Genus,
  UpdateGenusDto,
} from '@/interfaces/genus.interface';
import { Family, familyToString } from '@/interfaces/family.interface';
import { CreateFamilyForm } from './CrudFamilyForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';


const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('El género necesita un nombre'),
  description: Yup.string(),
  family: Yup.object().required('Por favor seleccione una familia'),
});

interface Values {
  name: string;
  description: string;
  family: any;
}

interface CreateGenusFormProps {
  toggleVisibility: Function;
}

export const CreateGenusForm = (props: CreateGenusFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateFamilyModal, setOpenCreateFamilyModal] =
    useState<boolean>(false);

  const toggleOpenCreateFamilyModal = () => {
    setOpenCreateFamilyModal(!openCreateFamilyModal);
  };

  // Lista de familias para Select
  const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
    useGetFamilies({});

  // Mutación
  const {
    mutate: createGenusMutate,
    isLoading: createGenusIsLoading,
  } = useCreateGenus();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      family: {},
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createGenusDto: CreateGenusDto = {
        name: values.name,
        description: values.description,
        familyId: values.family.id,
      };

      createGenusMutate(
        { createGenusDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear género');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear género', {
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title='Registrar nuevo género' />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el género puede agregar en Nombre: SIN
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
            id='family'
            options={(getFamiliesData ?? []) as Family[]}
            getOptionLabel={(family: Family) => familyToString(family)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='family'
                label='Familia'
                placeholder='Familia...'
                error={formik.touched.family && Boolean(formik.errors.family)}
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, family: Family) => {
              return (
                <li {...props} key={family.id}>
                  {familyToString(family)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Family) => {
              formik.setFieldValue('family', selection);
              setOrderTax(selection?.orderTax.name ?? '');
              setClassTax(selection?.orderTax.classTax.name ?? '');
              setPhylum(selection?.orderTax.classTax.phylum.name ?? '');
              setKingdom(
                selection?.orderTax.classTax.phylum.kingdom.name ?? ''
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateFamilyModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>
          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateFamilyModal}
            onClose={() => setOpenCreateFamilyModal(false)}
            isDismissable={false}
            scrollBehavior="outside"
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateFamilyForm
                    toggleVisibility={toggleOpenCreateFamilyModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
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
          disabled={createGenusIsLoading}
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
          disabled={createGenusIsLoading}
        >
          {createGenusIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface UpdateGenusFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateGenusForm = (props: UpdateGenusFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateFamilyModal, setOpenCreateFamilyModal] =
    useState<boolean>(false);

  const toggleOpenCreateFamilyModal = () => {
    setOpenCreateFamilyModal(!openCreateFamilyModal);
  };

  // Lista de familias para Select
  const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
    useGetFamilies({});

  // Query
  const {
    isSuccess: getGenusIsSuccess,
    data: getGenusData,
  } = useGetGenus({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateGenusMutate,
    isLoading: updateGenusIsLoading,
  } = useUpdateGenus();

  const formik = useFormik({
    initialValues: {
      name: getGenusData?.name ?? '',
      description: getGenusData?.description ?? '',
      family: getGenusData?.family ?? {},
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateGenusDto: UpdateGenusDto = {
        id: id,
        name: values.name,
        description: values.description,
        familyId: values.family.id,
      };

      updateGenusMutate(
        { updateGenusDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar género');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar género', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (genus: Genus) => {
            console.log('Género actualizado correctamente');
            console.log(genus);
            queryClient.invalidateQueries(['genera']);
            queryClient.invalidateQueries([`genus-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Género actualizado correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (
      getGenusIsSuccess &&
      getGenusData.family.orderTax.classTax.phylum.kingdom
    ) {
      setOrderTax(getGenusData.family.orderTax.name);
      setClassTax(getGenusData.family.orderTax.classTax.name);
      setPhylum(getGenusData.family.orderTax.classTax.phylum.name);
      setKingdom(getGenusData.family.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getGenusIsSuccess]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Actualizar género N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el género puede agregar en Nombre: SIN
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
            id='family'
            options={(getFamiliesData ?? []) as Family[]}
            getOptionLabel={(family: Family) => familyToString(family)}
            value={formik.values.family as Family}
            renderInput={(params) => (
              <TextField
                {...params}
                name='family'
                label='Familia'
                placeholder='Familia...'
                error={formik.touched.family && Boolean(formik.errors.family)}
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, family: Family) => {
              return (
                <li {...props} key={family.id}>
                  {familyToString(family)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Family) => {
              formik.setFieldValue('family', selection);
              setOrderTax(selection?.orderTax.name ?? '');
              setClassTax(selection?.orderTax.classTax.name ?? '');
              setPhylum(selection?.orderTax.classTax.phylum.name ?? '');
              setKingdom(
                selection?.orderTax.classTax.phylum.kingdom.name ?? ''
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateFamilyModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>
          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateFamilyModal}
            onClose={() => setOpenCreateFamilyModal(false)}
            isDismissable={false}
            scrollBehavior="outside"
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateFamilyForm
                    toggleVisibility={toggleOpenCreateFamilyModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
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
          disabled={updateGenusIsLoading}
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
          disabled={updateGenusIsLoading}
        >
          {updateGenusIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface DeleteGenusFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteGenusForm = (props: DeleteGenusFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    isSuccess: getGenusIsSuccess,
    data: getGenusData,
  } = useGetGenus({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteGenusMutate,
    isLoading: deleteGenusIsLoading,
  } = useDeleteGenus();

  const deleteGenus = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteGenusMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar género');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar género', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Género eliminado correctamente');
          queryClient.invalidateQueries(['genera']);
          queryClient.invalidateQueries([`genus-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Género eliminado correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (
      getGenusIsSuccess &&
      getGenusData.family.orderTax.classTax.phylum.kingdom
    ) {
      setOrderTax(getGenusData.family.orderTax.name);
      setClassTax(getGenusData.family.orderTax.classTax.name);
      setPhylum(getGenusData.family.orderTax.classTax.phylum.name);
      setKingdom(getGenusData.family.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getGenusIsSuccess]);

  return (
    <form onSubmit={(event) => deleteGenus(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar género N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar un género!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getGenusData?.name ?? ''}
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
            value={getGenusData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='family'
            name='family'
            label='Familia'
            value={
              getGenusData?.family
                ? familyToString(getGenusData.family)
                : ''
            }
            fullWidth
            autoComplete='family'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
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
          disabled={deleteGenusIsLoading}
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
          disabled={deleteGenusIsLoading}
        >
          {deleteGenusIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Grid>
    </form>
  );
};

interface ModalCrudGenusProps {
  id: number;
}

export const ModalCrudGenus = (props: ModalCrudGenusProps) => {
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
          scrollBehavior="outside"
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <UpdateGenusForm toggleVisibility={setShowEditModal} id={id} />
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
          scrollBehavior="outside"
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <DeleteGenusForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
