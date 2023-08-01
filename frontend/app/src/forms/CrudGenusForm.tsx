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
  useCreateFamily,
  useCreateGenus,
  useDeleteFamily,
  useDeleteGenus,
  useGetFamilies,
  useGetFamily,
  useGetGenus,
  useGetOrdersTax,
  useUpdateFamily,
  useUpdateGenus,
} from '../api/hooks';
import { useJwtToken } from '../features/auth/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '../components/PageSubTitle';
import { FormEvent, useEffect, useState } from 'react';
import { CreatePhylumForm } from './CrudPhylumForm';
import { OrderTax, orderTaxToString } from '../interfaces/OrderTaxInterface';
import {
  CreateFamilyDto,
  Family,
  UpdateFamilyDto,
  familyToString,
} from '../interfaces/FamilyInterface';
import {
  CreateGenusDto,
  Genus,
  UpdateGenusDto,
} from '../interfaces/GenusInterface';

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
  const token = useJwtToken();
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
    // isSuccess: createGenusIsSuccess,
    // isError: createGenusIsError,
    // error: createGenusError,
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
        { token: token ?? '', createGenusDto },
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
            queryClient.invalidateQueries(['genera-tax']);
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
          <Tooltip title='Nuevo' arrow>
            <IconButton
              type='button'
              onClick={() => toggleOpenCreateFamilyModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateFamilyModal(false)}
            open={openCreateFamilyModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreatePhylumForm
                toggleVisibility={toggleOpenCreateFamilyModal}
              />
            </div>
          </Dialog>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
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
    </form>
  );
};

interface UpdateGenusFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateGenusForm = (props: UpdateGenusFormProps) => {
  const { toggleVisibility, id } = props;
  const token = useJwtToken();
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
    // isLoading: getGenusIsLoading,
    isSuccess: getGenusIsSuccess,
    data: getGenusData,
    // isError: getGenusIsError,
    // error: getGenusError,
  } = useGetGenus({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateGenusMutate,
    isLoading: updateGenusIsLoading,
    // isSuccess: updateGenusIsSuccess,
    // isError: updateGenusIsError,
    // error: updateGenusError,
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
        { token: token ?? '', updateGenusDto },
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
            queryClient.invalidateQueries(['genera-tax']);
            queryClient.invalidateQueries([`genus-tax-${id}`]);
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
          <Tooltip title='Nuevo' arrow>
            <IconButton
              type='button'
              onClick={() => toggleOpenCreateFamilyModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateFamilyModal(false)}
            open={openCreateFamilyModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreatePhylumForm
                toggleVisibility={toggleOpenCreateFamilyModal}
              />
            </div>
          </Dialog>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={updateGenusIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={updateGenusIsLoading}
        >
          {updateGenusIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
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
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    // isLoading: getGenusIsLoading,
    isSuccess: getGenusIsSuccess,
    data: getGenusData,
    // isError: getGenusIsError,
    // error: getGenusError,
  } = useGetGenus({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteGenusMutate,
    isLoading: deleteGenusIsLoading,
    // isSuccess: deleteGenusIsSuccess,
    // isError: deleteGenusIsError,
    // error: deleteGenusError,
  } = useDeleteGenus();

  const deleteGenus = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteGenusMutate(
      { token: token ?? '', id: id },
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
          queryClient.invalidateQueries(['genera-tax']);
          queryClient.invalidateQueries([`genus-tax-${id}`]);
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
              getGenusData?.family ? familyToString(getGenusData.family) : ''
            }
            fullWidth
            autoComplete='family'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <MDBBtn
          color='primary'
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteGenusIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='danger'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deleteGenusIsLoading}
        >
          {deleteGenusIsLoading ? 'Eliminando...' : 'Eliminar'}
        </MDBBtn>
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
            <UpdateGenusForm toggleVisibility={setShowEditModal} id={id} />
          </div>
        </Dialog>
        <Dialog
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          maxWidth={'md'}
          fullWidth
        >
          <div className='p-5'>
            <DeleteGenusForm toggleVisibility={setShowDeleteModal} id={id} />
          </div>
        </Dialog>
      </div>
    </>
  );
};
