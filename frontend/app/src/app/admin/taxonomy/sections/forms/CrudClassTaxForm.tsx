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
  useCreateClassTax,
  useDeleteClassTax,
  useGetClassTax,
  useGetPhylums,
  useUpdateClassTax,
} from '@/services/hooks';
import {
  ClassTax,
  CreateClassTaxDto,
  UpdateClassTaxDto,
} from '@/interfaces/class-tax.interface';
import { Phylum, phylumToString } from '@/interfaces/phylum.interface';
import { CreatePhylumForm } from './CrudPhylumForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';


const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('La clase necesita un nombre'),
  description: Yup.string(),
  phylum: Yup.object().required('Por favor seleccione un filo'),
});

interface Values {
  name: string;
  description: string;
  phylum: any;
}

interface CreateClassTaxFormProps {
  toggleVisibility: Function;
}

export const CreateClassTaxForm = (props: CreateClassTaxFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreatePhylumModal, setOpenCreatePhylumModal] =
    useState<boolean>(false);

  const toggleOpenCreatePhylumModal = () => {
    setOpenCreatePhylumModal(!openCreatePhylumModal);
  };

  // Lista de filos para Select
  const { isSuccess: getPhylumsIsSuccess, data: getPhylumsData } =
    useGetPhylums({});

  // Mutación
  const {
    mutate: createClassTaxMutate,
    isLoading: createClassTaxIsLoading,
  } = useCreateClassTax();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      phylum: {},
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createClassTaxDto: CreateClassTaxDto = {
        name: values.name,
        description: values.description,
        phylumId: values.phylum.id,
      };

      createClassTaxMutate(
        { createClassTaxDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear clase');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear clase', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (classTax: ClassTax) => {
            console.log('Clase creada correctamente');
            console.log(classTax);
            queryClient.invalidateQueries(['classes-tax']);
            toggleVisibility(false);
            enqueueSnackbar('Clase creada correctamente', {
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
          <PageSubTitle title='Registrar nueva clase' />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce la clase puede agregar en Nombre: SIN
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
            id='phylum'
            options={(getPhylumsData ?? []) as Phylum[]}
            getOptionLabel={(phylum: Phylum) => phylumToString(phylum)}
            renderInput={(params) => (
              <TextField
                {...params}
                name='phylum'
                label='Filo'
                placeholder='Filo...'
                error={formik.touched.phylum && Boolean(formik.errors.phylum)}
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, phylum: Phylum) => {
              return (
                <li {...props} key={phylum.id}>
                  {phylumToString(phylum)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Phylum) => {
              formik.setFieldValue('phylum', selection);
              setKingdom(selection?.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreatePhylumModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreatePhylumModal}
            onClose={() => setOpenCreatePhylumModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreatePhylumForm
                    toggleVisibility={toggleOpenCreatePhylumModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={createClassTaxIsLoading}
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
          disabled={createClassTaxIsLoading}
        >
          {createClassTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface UpdateClassTaxFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateClassTaxForm = (props: UpdateClassTaxFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreatePhylumModal, setOpenCreatePhylumModal] =
    useState<boolean>(false);

  const toggleOpenCreatePhylumModal = () => {
    setOpenCreatePhylumModal(!openCreatePhylumModal);
  };

  // Lista de filos para Select
  const { isSuccess: getPhylumsIsSuccess, data: getPhylumsData } =
    useGetPhylums({});

  // Query
  const {
    isSuccess: getClassTaxIsSuccess,
    data: getClassTaxData,
  } = useGetClassTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateClassTaxMutate,
    isLoading: updateClassTaxIsLoading,
  } = useUpdateClassTax();

  const formik = useFormik({
    initialValues: {
      name: getClassTaxData?.name ?? '',
      description: getClassTaxData?.description ?? '',
      phylum: getClassTaxData?.phylum ?? {},
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateClassTaxDto: UpdateClassTaxDto = {
        id: id,
        name: values.name,
        description: values.description,
        phylumId: values.phylum.id,
      };

      updateClassTaxMutate(
        { updateClassTaxDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar clase');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar clase', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (classTax: ClassTax) => {
            console.log('Clase actualizada correctamente');
            console.log(classTax);
            queryClient.invalidateQueries(['classes-tax']);
            queryClient.invalidateQueries([`class-tax-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Clase actualizada correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (getClassTaxIsSuccess && getClassTaxData.phylum.kingdom)
      setKingdom(getClassTaxData.phylum.kingdom.name);
  }, [getClassTaxIsSuccess]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Actualizar clase N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='info'>
            Recuerde que si no conoce la clase puede agregar en Nombre: SIN
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
            id='phylum'
            options={(getPhylumsData ?? []) as Phylum[]}
            getOptionLabel={(phylum: Phylum) => phylumToString(phylum)}
            value={formik.values.phylum as Phylum}
            renderInput={(params) => (
              <TextField
                {...params}
                name='phylum'
                label='Filo'
                placeholder='Filo...'
                error={formik.touched.phylum && Boolean(formik.errors.phylum)}
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, phylum: Phylum) => {
              return (
                <li {...props} key={phylum.id}>
                  {phylumToString(phylum)}
                </li>
              );
            }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection: Phylum) => {
              formik.setFieldValue('phylum', selection);
              setKingdom(selection?.kingdom.name ?? '');
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
              onClick={() => toggleOpenCreatePhylumModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          <Modal
            size="5xl"
            radius="sm"
            isOpen={openCreatePhylumModal}
            onClose={() => setOpenCreatePhylumModal(false)}
            isDismissable={false}
          >
            <ModalThemeWrapper>
              <ModalContent>
                <div className='p-5 bg-light dark:bg-dark'>
                  <CreatePhylumForm
                    toggleVisibility={toggleOpenCreatePhylumModal}
                  />
                </div>
              </ModalContent>
            </ModalThemeWrapper>
          </Modal>
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
          disabled={updateClassTaxIsLoading}
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
          disabled={updateClassTaxIsLoading}
        >
          {updateClassTaxIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface DeleteClassTaxFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteClassTaxForm = (props: DeleteClassTaxFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    isSuccess: getClassTaxIsSuccess,
    data: getClassTaxData,
  } = useGetClassTax({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteClassTaxMutate,
    isLoading: deleteClassTaxIsLoading,
  } = useDeleteClassTax();

  const deleteClasstax = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteClassTaxMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar clase');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar clase', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Clase eliminada correctamente');
          queryClient.invalidateQueries(['classes-tax']);
          queryClient.invalidateQueries([`class-tax-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Clase eliminada correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (getClassTaxIsSuccess && getClassTaxData.phylum.kingdom)
      setKingdom(getClassTaxData.phylum.kingdom.name);
  }, [getClassTaxIsSuccess]);

  return (
    <form onSubmit={(event) => deleteClasstax(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar clase N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar una clase!</Alert>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id='name'
            name='name'
            label='Nombre'
            value={getClassTaxData?.name ?? ''}
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
            value={getClassTaxData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='phylum'
            name='phylum'
            label='Filo'
            value={
              getClassTaxData?.phylum
                ? phylumToString(getClassTaxData.phylum)
                : ''
            }
            fullWidth
            autoComplete='phylum'
            autoFocus
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
          disabled={deleteClassTaxIsLoading}
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
          disabled={deleteClassTaxIsLoading}
        >
          {deleteClassTaxIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Grid>
    </form>
  );
};

interface ModalCrudClassTaxProps {
  id: number;
}

export const ModalCrudClassTax = (props: ModalCrudClassTaxProps) => {
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
                <UpdateClassTaxForm toggleVisibility={setShowEditModal} id={id} />
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
                <DeleteClassTaxForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
