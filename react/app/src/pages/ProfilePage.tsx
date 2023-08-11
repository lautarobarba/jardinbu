import { PageSubTitle } from '../components/PageSubTitle';
import { PageTitle } from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { useGetAuthUser, useUpdateUser } from '../api/hooks';
import { useEffect, useState } from 'react';
import { MDBFile, MDBIcon } from 'mdb-react-ui-kit';
import { useJwtToken } from '../features/auth/authHooks';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { Field, FormikHelpers, useFormik } from 'formik';
import { UpdateUserDto } from '../interfaces/UpdateUserDto';
import { Button, Grid, TextField } from '@mui/material';

const ValidationSchema = Yup.object().shape({
  id: Yup.number().required('Obligatorio'),
  email: Yup.string().email('El email no es válido').required('Obligatorio'),
  isEmailConfirmed: Yup.boolean(),
  // .required('Obligatorio'),
  firstname: Yup.string()
    .min(2, 'Nombre Demasiado corto')
    .max(50, 'Nombre Demasiado largo'),
  // .required('Obligatorio'),
  lastname: Yup.string()
    .min(2, 'Nombre Demasiado corto')
    .max(50, 'Nombre Demasiado largo'),
  // .required('Obligatorio'),
  profilePicture: Yup.object(),
  // .shape({
  //   attachment: Yup.mixed()
  // .test("fileSize", "El tamaño es muy grande", (value) => {
  //   if (!value.length) return true // attachment is optional
  //   return value[0].size <= 10485760 // 10MB limit (creo jaja)
  // }),
  // }),
  status: Yup.string(),
  // .required('Obligatorio'),
  role: Yup.string(),
  // .required('Obligatorio'),
});

export const ProfilePage = () => {
  const jwtToken = useJwtToken();
  const queryClient = useQueryClient();

  // Query datos actuales
  const {
    isLoading: getAuthUserIsLoading,
    data: getAuthUserData,
    isSuccess: getAuthUserIsSuccess,
    isError: getAuthUserIsError,
    // error: getAuthUserError
  } = useGetAuthUser(jwtToken ?? '');

  // Mutacion para actualizar
  const {
    mutate: updateUserMutate,
    isLoading: updateUserIsLoading,
    isSuccess: updateUserIsSuccess,
    isError: updateUserIsError,
    error: updateUserError,
  } = useUpdateUser();

  // Valores iniciales
  const [initialValues, setInitialValues] = useState({
    id: 0,
    // email: '',
    firstname: '',
    lastname: '',
    profilePicture: null,
  });

  // Formulario
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    // validationSchema: ValidationSchema,
    onSubmit: (
      values: UpdateUserDto,
      { setErrors }: FormikHelpers<UpdateUserDto>
    ) => {
      console.log({
        msg: 'ACTUALIZANDO',
        values,
      });
      // Actualizo el usuario
      updateUserMutate({
        updateUserDto: values,
        token: jwtToken ?? '',
      });
    },
  });

  // Inicializo nuevamente valores del formulario
  const resetForm = () => {
    setInitialValues({
      id: getAuthUserData.id ?? '',
      // email: getAuthUserData.email ?? '',
      firstname: getAuthUserData.firstname ?? '',
      lastname: getAuthUserData.lastname ?? '',
      profilePicture: null,
    });
  };

  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (getAuthUserIsSuccess) {
      console.log({ getAuthUserData });
      resetForm();
    }
  }, [getAuthUserIsSuccess, getAuthUserData]);

  const toggleEdit = (event: any) => {
    console.log('toggleEdit()');
    if (event) {
      event.preventDefault();
    }
    const newEditState = !editMode;
    setEditMode(newEditState);

    if (!newEditState) {
      console.log('Inicializo nuevamente valores del formulario');
      resetForm();
    }
  };

  useEffect(() => {
    if (updateUserIsSuccess || updateUserIsError) {
      // Ivalidate query
      toggleEdit(null);
    }
  }, [updateUserIsSuccess, updateUserIsError]);

  return (
    <div className='bg-white p-3'>
      <PageTitle title='Perfil' />
      <Link to='/app/admin' className='text-danger'>
        <MDBIcon fas icon='arrow-circle-left' size='2x' />
      </Link>
      <PageSubTitle title='Info' />

      {getAuthUserIsError && <p className='text-danger'>Error...</p>}

      {getAuthUserIsLoading && <p className='h4'>Cargando...</p>}

      {getAuthUserIsSuccess && (
        <div className='profile'>
          {/* Foto de perfil */}
          <div className='m-5'>
            {getAuthUserData.profilePicture ? (
              <img
                loading='lazy'
                src={`http://localhost:7001/api/user/profile-picture/${getAuthUserData.profilePicture?.id}`}
                width='100'
              />
            ) : (
              <p className='h4'>Sin imagen de perfil (poner default).</p>
            )}
          </div>
          {/* Renderizo el formulario sólo si recupere correctamente los datos */}
          {formik ? (
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    disabled
                    fullWidth
                    id='email'
                    name='email'
                    label='Email'
                    value={getAuthUserData.email ?? ''}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    id='firstname'
                    name='firstname'
                    label='Nombre'
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstname &&
                      Boolean(formik.errors.firstname)
                    }
                    helperText={
                      formik.touched.firstname && formik.errors.firstname
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    disabled={!editMode}
                    fullWidth
                    id='lastname'
                    name='lastname'
                    label='Apellido'
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastname && Boolean(formik.errors.lastname)
                    }
                    helperText={
                      formik.touched.lastname && formik.errors.lastname
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MDBFile
                    disabled={!editMode}
                    id='profilePicture'
                    name='profilePicture'
                    label='Foto'
                    // value={formik.values.profilePicture}
                    onChange={(event: any) => {
                      formik.setFieldValue(
                        'profilePicture',
                        event.target.files[0]
                      );
                    }}
                  // error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                  // helperText={formik.touched.lastname && formik.errors.lastname}
                  />

                  {/* <input type="file" name="profilePicture"></input> */}
                </Grid>
                {editMode ? (
                  <Grid item xs={12} className='text-center text-md-right'>
                    <Button
                      type='button'
                      variant='contained'
                      onClick={(event) => toggleEdit(event)}
                      className='btn-danger mx-1'
                    >
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      className='btn-success mx-1'
                    >
                      Guardar
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={12} className='text-center text-md-right'>
                    <Button
                      type='button'
                      variant='contained'
                      onClick={(event) => toggleEdit(event)}
                      className='btn-primary mx-1'
                    >
                      Editar
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          ) : (
            <p className='h4'>Cargando...</p>
          )}
        </div>
      )}
    </div>
  );
};
