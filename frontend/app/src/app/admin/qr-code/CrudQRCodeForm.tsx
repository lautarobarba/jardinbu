"use client";
import { FormEvent, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip } from '@nextui-org/react';
import { Alert, Grid, TextField } from '@mui/material';
import {
  useCreateKingdom,
  useCreateQRCode,
  useDeleteKingdom,
  useDeleteQRCode,
  useGetKingdom,
  useGetQRCode,
  useUpdateKingdom,
  useUpdateQRCode,
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
import { CreateQRCodeDto, QRCode, UpdateQRCodeDto } from '@/interfaces/qr-code.interface';


const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Demasiado corto')
    .max(200, 'Demasiado largo')
    .required('El código QR necesita un título'),
  link: Yup.string().required('El código QR necesita un enlace'),
});

interface Values {
  title: string;
  link: string;
}

interface CreateQRCodeFormProps {
  toggleVisibility: Function;
}

export const CreateQRCodeForm = (props: CreateQRCodeFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Mutación
  const {
    mutate: createQRCodeMutate,
    isLoading: createQRCodeIsLoading,
  } = useCreateQRCode();

  const formik = useFormik({
    initialValues: {
      title: '',
      link: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createQRCodeDto: CreateQRCodeDto = {
        title: values.title,
        link: values.link,
      };

      createQRCodeMutate(
        { createQRCodeDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear código QR');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear código QR', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (qRCode: QRCode) => {
            console.log('Código QR creado correctamente');
            console.log(qRCode);
            queryClient.invalidateQueries(['qr-codes']);
            toggleVisibility(false);
            enqueueSnackbar('Código QR creado correctamente', {
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
          <PageSubTitle title='Registrar nuevo código QR' />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='title'
            name='title'
            label='Título/Descripción'
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
            required
            autoComplete='title'
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='link'
            name='link'
            label='Link/Enlace'
            value={formik.values.link}
            onChange={formik.handleChange}
            error={
              formik.touched.link && Boolean(formik.errors.link)
            }
            helperText={formik.touched.link && formik.errors.link}
            fullWidth
            autoComplete='link'
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
          disabled={createQRCodeIsLoading}
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
          disabled={createQRCodeIsLoading}
        >
          {createQRCodeIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface UpdateQRCodeFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateQRCodeForm = (props: UpdateQRCodeFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Query
  const {
    data: getQRCodeData,
  } = useGetQRCode({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateQRCodeMutate,
    isLoading: updateQRCodeIsLoading,
  } = useUpdateQRCode();

  const formik = useFormik({
    initialValues: {
      title: getQRCodeData?.title ?? '',
      link: getQRCodeData?.link ?? '',
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateQRCodeDto: UpdateQRCodeDto = {
        id: id,
        title: values.title,
        link: values.link,
      };

      updateQRCodeMutate(
        { updateQRCodeDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar código QR');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar código QR', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (qRCode: QRCode) => {
            console.log('Código QR actualizado correctamente');
            console.log(qRCode);
            queryClient.invalidateQueries(['qr-codes']);
            queryClient.invalidateQueries([`qr-code-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Código QR actualizado correctamente', {
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
          <PageSubTitle title={`Actualizar código QR N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='title'
            name='title'
            label='Título/Descripción'
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
            required
            autoComplete='title'
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='link'
            name='link'
            label='Link/Enlace'
            value={formik.values.link}
            onChange={formik.handleChange}
            error={
              formik.touched.link && Boolean(formik.errors.link)
            }
            helperText={formik.touched.link && formik.errors.link}
            fullWidth
            autoComplete='link'
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
          disabled={updateQRCodeIsLoading}
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
          disabled={updateQRCodeIsLoading}
        >
          {updateQRCodeIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface DeleteQRCodeFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteQRCodeForm = (props: DeleteQRCodeFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Query
  const {
    data: getQRCodeData,
  } = useGetQRCode({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteQRCodeMutate,
    isLoading: deleteQRCodeIsLoading,
  } = useDeleteQRCode();

  const deleteQRCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteQRCodeMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar código QR');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar código QR', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Código QR eliminado correctamente');
          queryClient.invalidateQueries(['qr-codes']);
          queryClient.invalidateQueries([`qr-code-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Código QR eliminado correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={(event) => deleteQRCode(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar código QR N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar un código QR!</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='title'
            name='title'
            label='Título/Descripción'
            value={getQRCodeData?.title ?? ''}
            fullWidth
            required
            autoComplete='title'
            autoFocus
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='link'
            name='link'
            label='Link/Enlace'
            value={getQRCodeData?.link ?? ''}
            fullWidth
            autoComplete='link'
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
          disabled={deleteQRCodeIsLoading}
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
          disabled={deleteQRCodeIsLoading}
        >
          {deleteQRCodeIsLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Grid>
    </form>
  );
};

interface ModalCrudQRCodeProps {
  id: number;
}

export const ModalCrudQRCode = (props: ModalCrudQRCodeProps) => {
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
                <UpdateQRCodeForm toggleVisibility={setShowEditModal} id={id} />
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
                <DeleteQRCodeForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div >
    </>
  );
};
