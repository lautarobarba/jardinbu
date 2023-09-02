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
  useCreateFamily,
  useDeleteFamily,
  useGetFamily,
  useGetOrdersTax,
  useUpdateFamily,
} from '@/services/hooks';
import {
  CreateFamilyDto,
  Family,
  UpdateFamilyDto,
} from '@/interfaces/family.interface';
import { OrderTax, orderTaxToString } from '@/interfaces/order-tax.interface';
import { CreateOrderTaxForm } from './CrudOrderTaxForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';


const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('La familia necesita un nombre'),
  description: Yup.string(),
  orderTax: Yup.object().required('Por favor seleccione un orden'),
});

interface Values {
  name: string;
  description: string;
  orderTax: any;
}

interface CreateFamilyFormProps {
  toggleVisibility: Function;
}

export const CreateFamilyForm = (props: CreateFamilyFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateOrderTaxModal, setOpenCreateOrderTaxModal] =
    useState<boolean>(false);

  const toggleOpenCreateOrderTaxModal = () => {
    setOpenCreateOrderTaxModal(!openCreateOrderTaxModal);
  };

  // Lista de ordenes para Select
  const { isSuccess: getOrdersTaxIsSuccess, data: getOrdersTaxData } =
    useGetOrdersTax({});

  // Mutación
  const {
    mutate: createFamilyMutate,
    isLoading: createFamilyIsLoading,
  } = useCreateFamily();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      orderTax: {},
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createFamilyDto: CreateFamilyDto = {
        name: values.name,
        description: values.description,
        orderTaxId: values.orderTax.id,
      };

      createFamilyMutate(
        { createFamilyDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear familia');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear familia', {
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

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce la familia puede agregar en Nombre: SIN
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
            id='orderTax'
            options={(getOrdersTaxData ?? []) as OrderTax[]}
            getOptionLabel={(orderTax: OrderTax) => orderTaxToString(orderTax)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='orderTax'
                label='Orden'
                placeholder='Orden...'
                error={
                  formik.touched.orderTax && Boolean(formik.errors.orderTax)
                }
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, orderTax: OrderTax) => {
              return (
                <li {...props} key={orderTax.id}>
                  {orderTaxToString(orderTax)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: OrderTax) => {
              formik.setFieldValue('orderTax', selection);
              setClassTax(selection?.classTax.name ?? '');
              setPhylum(selection?.classTax.phylum.name ?? '');
              setKingdom(selection?.classTax.phylum.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreateOrderTaxModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateOrderTaxModal}
            onClose={() => setOpenCreateOrderTaxModal(false)}
            isDismissable={false}
            scrollBehavior="outside"
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateOrderTaxForm
                    toggleVisibility={toggleOpenCreateOrderTaxModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={createFamilyIsLoading}
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
          disabled={createFamilyIsLoading}
        >
          {createFamilyIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface UpdateFamilyFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateFamilyForm = (props: UpdateFamilyFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateOrderTaxModal, setOpenCreateOrderTaxModal] =
    useState<boolean>(false);

  const toggleOpenCreateOrderTaxModal = () => {
    setOpenCreateOrderTaxModal(!openCreateOrderTaxModal);
  };

  // Lista de ordenes para Select
  const { isSuccess: getOrdersTaxIsSuccess, data: getOrdersTaxData } =
    useGetOrdersTax({});

  // Query
  const {
    isSuccess: getFamilyIsSuccess,
    data: getFamilyData,
  } = useGetFamily({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateFamilyMutate,
    isLoading: updateFamilyIsLoading,
  } = useUpdateFamily();

  const formik = useFormik({
    initialValues: {
      name: getFamilyData?.name ?? '',
      description: getFamilyData?.description ?? '',
      orderTax: getFamilyData?.orderTax ?? {},
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateFamilyDto: UpdateFamilyDto = {
        id: id,
        name: values.name,
        description: values.description,
        orderTaxId: values.orderTax.id,
      };

      updateFamilyMutate(
        { updateFamilyDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar familia');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar familia', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (family: Family) => {
            console.log('Familia actualizada correctamente');
            console.log(family);
            queryClient.invalidateQueries(['families']);
            queryClient.invalidateQueries([`family-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Familia actualizada correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (getFamilyIsSuccess && getFamilyData.orderTax.classTax.phylum.kingdom) {
      setClassTax(getFamilyData.orderTax.classTax.name);
      setPhylum(getFamilyData.orderTax.classTax.phylum.name);
      setKingdom(getFamilyData.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getFamilyIsSuccess]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Actualizar familia N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce la familia puede agregar en Nombre: SIN
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
            id='orderTax'
            options={(getOrdersTaxData ?? []) as OrderTax[]}
            getOptionLabel={(orderTax: OrderTax) => orderTaxToString(orderTax)}
            value={formik.values.orderTax as OrderTax}
            renderInput={(params) => (
              <TextField
                {...params}
                name='orderTax'
                label='Orden'
                placeholder='Orden...'
                error={
                  formik.touched.orderTax && Boolean(formik.errors.orderTax)
                }
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, orderTax: OrderTax) => {
              return (
                <li {...props} key={orderTax.id}>
                  {orderTaxToString(orderTax)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: OrderTax) => {
              formik.setFieldValue('orderTax', selection);
              setClassTax(selection?.classTax.name ?? '');
              setPhylum(selection?.classTax.phylum.name ?? '');
              setKingdom(selection?.classTax.phylum.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreateOrderTaxModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreateOrderTaxModal}
            onClose={() => setOpenCreateOrderTaxModal(false)}
            isDismissable={false}
            scrollBehavior="outside"
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreateOrderTaxForm
                    toggleVisibility={toggleOpenCreateOrderTaxModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={updateFamilyIsLoading}
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
          disabled={updateFamilyIsLoading}
        >
          {updateFamilyIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface DeleteFamilyFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteFamilyForm = (props: DeleteFamilyFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    isSuccess: getFamilyIsSuccess,
    data: getFamilyData,
  } = useGetFamily({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteFamilyMutate,
    isLoading: deleteFamilyIsLoading,
  } = useDeleteFamily();

  const deleteFamily = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteFamilyMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar familia');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar familia', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Familia eliminada correctamente');
          queryClient.invalidateQueries(['families']);
          queryClient.invalidateQueries([`family-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Familia eliminada correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (getFamilyIsSuccess && getFamilyData.orderTax.classTax.phylum.kingdom) {
      setClassTax(getFamilyData.orderTax.classTax.phylum.name);
      setPhylum(getFamilyData.orderTax.classTax.phylum.name);
      setKingdom(getFamilyData.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getFamilyIsSuccess]);

  return (
    <form onSubmit={(event) => deleteFamily(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar orden N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar una familia!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getFamilyData?.name ?? ''}
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
            value={getFamilyData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='orderTax'
            name='orderTax'
            label='Orden'
            value={
              getFamilyData?.orderTax
                ? orderTaxToString(getFamilyData.orderTax)
                : ''
            }
            fullWidth
            autoComplete='orderTax'
            autoFocus
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
          disabled={deleteFamilyIsLoading}
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
          disabled={deleteFamilyIsLoading}
        >
          {deleteFamilyIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Grid>
    </form>
  );
};

interface ModalCrudFamilyProps {
  id: number;
}

export const ModalCrudFamily = (props: ModalCrudFamilyProps) => {
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
                <UpdateFamilyForm toggleVisibility={setShowEditModal} id={id} />
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
                <DeleteFamilyForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
