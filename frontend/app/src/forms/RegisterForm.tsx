import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { TextField } from '@mui/material';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { CreateUserDto } from '../interfaces/CreateUserDto';
import { useGetAuthUser, useRegister } from '../api/hooks';
import { SessionDto } from '../interfaces/SessionDto';
import { useAppDispatch } from '../redux/hooks';
import { setCredentials } from '../features/auth/authSlice';

const ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('El email no es válido')
    .required('La cuenta necesita un correo'),
  firstname: Yup.string()
    .min(2, 'Nombre Demasiado corto')
    .max(50, 'Nombre Demasiado largo')
    .required('El usuario necesita un nombre'),
  lastname: Yup.string()
    .min(1, 'Apellido Demasiado corto')
    .max(50, 'Apellido Demasiado largo')
    .required('El usuario necesita un apellido'),
  password: Yup.string()
    .min(2, 'Contraseña Demasiado corta')
    .max(50, 'Contraseña Demasiado larga')
    .required('La cuenta necesita una contraseña'),
  password2: Yup.string()
    .min(2, 'Contraseña Demasiado corta')
    .max(50, 'Contraseña Demasiado larga')
    .equals([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Por favor repita la contraseña'),
});

interface Values {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  password2: string;
}

export const RegisterForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    mutate: registerMutate,
    isLoading: registerIsLoading,
    isSuccess: registerIsSuccess,
    // isError: registerIsError,
    // error: registerError
  } = useRegister();

  const [session, setSession] = useState<SessionDto>({
    accessToken: '',
    refreshToken: '',
  });

  const {
    // isLoading: getAuthUserIsLoading,
    data: getAuthUserData,
    isSuccess: getAuthUserIsSuccess,
    // isError: getAuthUserIsError,
    // error: getAuthUserError
    // } = useGetAuthUser(session?.accessToken ,{
  } = useGetAuthUser(session.accessToken, {
    enabled: registerIsSuccess,
  });

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      password2: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createUserDto: CreateUserDto = {
        email: values.email,
        firstname: values.firstname,
        lastname: values.lastname,
        password: values.password,
      };

      // console.log({ createUserDto });
      registerMutate(
        { createUserDto },
        {
          onError: (error) => {
            console.log('ERROR: Error al registrar usuario.');
            console.log(error);
            enqueueSnackbar('ERROR: Error al registrar usuario.', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
            if (Axios.isAxiosError(error)) {
              const errorCode = error.response?.status;
              console.log({ errorCode });
              if (Number(errorCode) === 406) {
                console.log({
                  error: errorCode,
                  mensaje: error.response?.data.message,
                });
              } else if (Number(errorCode) === 409) {
                console.log({
                  error: errorCode,
                  mensaje: error.response?.data.message,
                });
                setErrors({
                  email: 'Este email ya se encuentra registrado',
                });
              } else if (Number(errorCode) === 413) {
                console.log({
                  error: errorCode,
                  mensaje: error.response?.data.message,
                });
              } else {
                console.log({
                  error: errorCode,
                  mensaje: error.response?.data.message,
                });
              }
            }
          },
          onSuccess: (session: SessionDto) => {
            console.log('¡Usuario registrado correctamente!');
            console.log(session);
            setSession(session);
            enqueueSnackbar('¡Usuario registrado correctamente!', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (registerIsSuccess && getAuthUserIsSuccess) {
      // console.log('Actualizar REDUX userSlice')
      // console.log({
      //   status: 'SUCCESS',
      //   user: getAuthUserData,
      //   session: session
      // });

      dispatch(
        setCredentials({
          user: getAuthUserData,
          session: session,
        })
      );
    }
  }, [
    registerIsSuccess,
    getAuthUserIsSuccess,
    getAuthUserData,
    dispatch,
    session,
  ]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        id='email'
        name='email'
        label='Email'
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
        margin='normal'
        required
        autoComplete='email'
        autoFocus
      />
      <TextField
        id='firstname'
        name='firstname'
        label='Nombre'
        value={formik.values.firstname}
        onChange={formik.handleChange}
        error={formik.touched.firstname && Boolean(formik.errors.firstname)}
        helperText={formik.touched.firstname && formik.errors.firstname}
        fullWidth
        margin='normal'
        required
        autoComplete='firstname'
        autoFocus
      />
      <TextField
        id='lastname'
        name='lastname'
        label='Apellido'
        value={formik.values.lastname}
        onChange={formik.handleChange}
        error={formik.touched.lastname && Boolean(formik.errors.lastname)}
        helperText={formik.touched.lastname && formik.errors.lastname}
        fullWidth
        margin='normal'
        required
        autoComplete='lastname'
        autoFocus
      />
      <TextField
        id='password'
        name='password'
        label='Contraseña'
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
        margin='normal'
        required
        autoComplete='off'
      />
      <TextField
        id='password2'
        name='password2'
        label='Repetir contraseña'
        type='password'
        value={formik.values.password2}
        onChange={formik.handleChange}
        error={formik.touched.password2 && Boolean(formik.errors.password2)}
        helperText={formik.touched.password2 && formik.errors.password2}
        fullWidth
        margin='normal'
        required
        autoComplete='off'
      />
      <MDBBtn
        color='primary'
        size='lg'
        type='submit'
        className='bg-dark w-100'
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
        disabled={registerIsLoading}
      >
        {registerIsLoading ? 'Registrando...' : 'Registrarse'}
      </MDBBtn>
      <div className='container'>
        <Link to={'/app/auth/login'} className='text-dark'>
          ¿Ya tenés cuenta? Iniciá sesión
        </Link>
      </div>
    </form>
  );
};
