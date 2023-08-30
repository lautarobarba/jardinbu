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
  useCreateOrderTax,
  useDeleteOrderTax,
  useGetClassesTax,
  useGetOrderTax,
  useUpdateOrderTax,
} from '@/services/hooks';
import { ClassTax, classTaxToString } from '@/interfaces/class-tax.interface';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { FormEvent, useEffect, useState } from 'react';
import {
  CreateOrderTaxDto,
  OrderTax,
  UpdateOrderTaxDto,
} from '@/interfaces/order-tax.interface';
import { CreateClassTaxForm } from './CrudClassTaxForm';

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('El orden necesita un nombre'),
  description: Yup.string(),
  classTax: Yup.object().required('Por favor seleccione una clase'),
});

interface Values {
  name: string;
  description: string;
  classTax: any;
}

interface CreateOrderTaxFormProps {
  toggleVisibility: Function;
}

export const CreateOrderTaxForm = (props: CreateOrderTaxFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateClassTaxModal, setOpenCreateClassTaxModal] =
    useState<boolean>(false);

  const toggleOpenCreateClassTaxModal = () => {
    setOpenCreateClassTaxModal(!openCreateClassTaxModal);
  };

  // Lista de clases para Select
  const { isSuccess: getClassesTaxIsSuccess, data: getClassesTaxData } =
    useGetClassesTax({});

  // Mutación
  const {
    mutate: createOrderTaxMutate,
    isLoading: createOrderTaxIsLoading,
    // isSuccess: createOrderTaxIsSuccess,
    // isError: createOrderTaxIsError,
    // error: createOrderTaxError,
  } = useCreateOrderTax();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      classTax: {},
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createOrderTaxDto: CreateOrderTaxDto = {
        name: values.name,
        description: values.description,
        classTaxId: values.classTax.id,
      };

      createOrderTaxMutate(
        { createOrderTaxDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear orden');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear orden', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (orderTax: OrderTax) => {
            console.log('Orden creado correctamente');
            console.log(orderTax);
            queryClient.invalidateQueries(['orders-tax']);
            toggleVisibility(false);
            enqueueSnackbar('Orden creado correctamente', {
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
          <PageSubTitle title='Registrar nuevo orden' />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el orden puede agregar en Nombre: SIN
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
            id='classTax'
            options={(getClassesTaxData ?? []) as ClassTax[]}
            getOptionLabel={(classTax: ClassTax) => classTaxToString(classTax)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='classTax'
                label='Clase'
                placeholder='Clase...'
                error={
                  formik.touched.classTax && Boolean(formik.errors.classTax)
                }
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: ClassTax) => {
              formik.setFieldValue('classTax', selection);
              setPhylum(selection?.phylum.name ?? '');
              setKingdom(selection?.phylum.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreateClassTaxModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateClassTaxModal(false)}
            open={openCreateClassTaxModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateClassTaxForm
                toggleVisibility={toggleOpenCreateClassTaxModal}
              />
            </div>
          </Dialog>
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
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={createOrderTaxIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={createOrderTaxIsLoading}
        >
          {createOrderTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface UpdateOrderTaxFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateOrderTaxForm = (props: UpdateOrderTaxFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateClassTaxModal, setOpenCreateClassTaxModal] =
    useState<boolean>(false);

  const toggleOpenCreateClassTaxModal = () => {
    setOpenCreateClassTaxModal(!openCreateClassTaxModal);
  };

  // Lista de clases para Select
  const { isSuccess: getClassesTaxIsSuccess, data: getClassesTaxData } =
    useGetClassesTax({});

  // Query
  const {
    // isLoading: getOrderTaxIsLoading,
    isSuccess: getOrderTaxIsSuccess,
    data: getOrderTaxData,
    // isError: getOrderTaxIsError,
    // error: getOrderTaxError,
  } = useGetOrderTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateOrderTaxMutate,
    isLoading: updateOrderTaxIsLoading,
    // isSuccess: updateOrderTaxIsSuccess,
    // isError: updateOrderTaxIsError,
    // error: updateOrderTaxError,
  } = useUpdateOrderTax();

  const formik = useFormik({
    initialValues: {
      name: getOrderTaxData?.name ?? '',
      description: getOrderTaxData?.description ?? '',
      classTax: getOrderTaxData?.classTax ?? {},
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateOrderTaxDto: UpdateOrderTaxDto = {
        id: id,
        name: values.name,
        description: values.description,
        classTaxId: values.classTax.id,
      };

      updateOrderTaxMutate(
        { updateOrderTaxDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar orden');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar orden', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (orderTax: OrderTax) => {
            console.log('Orden actualizado correctamente');
            console.log(orderTax);
            queryClient.invalidateQueries(['orders-tax']);
            queryClient.invalidateQueries([`order-tax-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Orden actualizado correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (getOrderTaxIsSuccess && getOrderTaxData.classTax.phylum.kingdom) {
      setPhylum(getOrderTaxData.classTax.phylum.name);
      setKingdom(getOrderTaxData.classTax.phylum.kingdom.name);
    }
  }, [getOrderTaxIsSuccess]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Actualizar orden N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce el orden puede agregar en Nombre: SIN
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
            id='classTax'
            options={(getClassesTaxData ?? []) as ClassTax[]}
            getOptionLabel={(classTax: ClassTax) => classTaxToString(classTax)}
            value={formik.values.classTax as ClassTax}
            renderInput={(params) => (
              <TextField
                {...params}
                name='classTax'
                label='Clase'
                placeholder='Clase...'
                error={
                  formik.touched.classTax && Boolean(formik.errors.classTax)
                }
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: ClassTax) => {
              formik.setFieldValue('classTax', selection);
              setPhylum(selection?.phylum.name ?? '');
              setKingdom(selection?.phylum.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreateClassTaxModal()}
            >
              <AddIcon className='text-primary' fontSize={'large'} />
            </IconButton>
          </Tooltip>

          <Dialog
            onClose={() => setOpenCreateClassTaxModal(false)}
            open={openCreateClassTaxModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateClassTaxForm
                toggleVisibility={toggleOpenCreateClassTaxModal}
              />
            </div>
          </Dialog>
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
        <MDBBtn
          color='danger'
          type='button'
          style={{ margin: '1rem' }}
          disabled={updateOrderTaxIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='primary'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={updateOrderTaxIsLoading}
        >
          {updateOrderTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface DeleteOrderTaxFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteOrderTaxForm = (props: DeleteOrderTaxFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    // isLoading: getClassTaxIsLoading,
    isSuccess: getOrderTaxIsSuccess,
    data: getOrderTaxData,
    // isError: getOrderTaxIsError,
    // error: getOrderTaxError,
  } = useGetOrderTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteOrderTaxMutate,
    isLoading: deleteOrderTaxIsLoading,
    // isSuccess: deleteOrderTaxIsSuccess,
    // isError: deleteOrderTaxIsError,
    // error: deleteOrderTaxError,
  } = useDeleteOrderTax();

  const deleteOrderTax = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteOrderTaxMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar orden');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar orden', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Orden eliminado correctamente');
          queryClient.invalidateQueries(['orders-tax']);
          queryClient.invalidateQueries([`order-tax-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Orden eliminado correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (getOrderTaxIsSuccess && getOrderTaxData.classTax.phylum.kingdom) {
      setPhylum(getOrderTaxData.classTax.phylum.name);
      setKingdom(getOrderTaxData.classTax.phylum.kingdom.name);
    }
  }, [getOrderTaxIsSuccess]);

  return (
    <form onSubmit={(event) => deleteOrderTax(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar orden N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar un orden!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getOrderTaxData?.name ?? ''}
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
            value={getOrderTaxData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='classTax'
            name='classTax'
            label='Clase'
            value={
              getOrderTaxData?.classTax
                ? classTaxToString(getOrderTaxData.classTax)
                : ''
            }
            fullWidth
            autoComplete='classTax'
            autoFocus
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
        <MDBBtn
          color='primary'
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteOrderTaxIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='danger'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deleteOrderTaxIsLoading}
        >
          {deleteOrderTaxIsLoading ? 'Eliminando...' : 'Eliminar'}
        </MDBBtn>
      </Grid>
    </form>
  );
};

interface ModalCrudOrderTaxProps {
  id: number;
}

export const ModalCrudOrderTax = (props: ModalCrudOrderTaxProps) => {
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
            <UpdateOrderTaxForm toggleVisibility={setShowEditModal} id={id} />
          </div>
        </Dialog>
        <Dialog
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          maxWidth={'md'}
          fullWidth
        >
          <div className='p-5'>
            <DeleteOrderTaxForm toggleVisibility={setShowDeleteModal} id={id} />
          </div>
        </Dialog>
      </div>
    </>
  );
};
