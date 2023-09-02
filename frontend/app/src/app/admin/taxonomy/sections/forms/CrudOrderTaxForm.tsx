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
  useCreateOrderTax,
  useDeleteOrderTax,
  useGetClassesTax,
  useGetOrderTax,
  useUpdateOrderTax,
} from '@/services/hooks';
import {
  CreateOrderTaxDto,
  OrderTax,
  UpdateOrderTaxDto,
} from '@/interfaces/order-tax.interface';
import { ClassTax, classTaxToString } from '@/interfaces/class-tax.interface';
import { CreateClassTaxForm } from './CrudClassTaxForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';


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
            renderOption={(props: HTMLAttributes<HTMLLIElement>, classTax: ClassTax) => {
              return (
                <li {...props} key={classTax.id}>
                  {classTaxToString(classTax)}
                </li>
              );
            }}
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateClassTaxModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateClassTaxModal}
            onClose={() => setOpenCreateClassTaxModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateClassTaxForm
                    toggleVisibility={toggleOpenCreateClassTaxModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={createOrderTaxIsLoading}
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
          disabled={createOrderTaxIsLoading}
        >
          {createOrderTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    isSuccess: getOrderTaxIsSuccess,
    data: getOrderTaxData,
  } = useGetOrderTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateOrderTaxMutate,
    isLoading: updateOrderTaxIsLoading,
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
            renderOption={(props: HTMLAttributes<HTMLLIElement>, classTax: ClassTax) => {
              return (
                <li {...props} key={classTax.id}>
                  {classTaxToString(classTax)}
                </li>
              );
            }}
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
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateClassTaxModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateClassTaxModal}
            onClose={() => setOpenCreateClassTaxModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateClassTaxForm
                    toggleVisibility={toggleOpenCreateClassTaxModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={updateOrderTaxIsLoading}
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
          disabled={updateOrderTaxIsLoading}
        >
          {updateOrderTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
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
    isSuccess: getOrderTaxIsSuccess,
    data: getOrderTaxData,
  } = useGetOrderTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteOrderTaxMutate,
    isLoading: deleteOrderTaxIsLoading,
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
        <Button
          color='success'
          radius="sm"
          className="uppercase text-white"
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteOrderTaxIsLoading}
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
          disabled={deleteOrderTaxIsLoading}
        >
          {deleteOrderTaxIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
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
                <UpdateOrderTaxForm toggleVisibility={setShowEditModal} id={id} />
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
                <DeleteOrderTaxForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
