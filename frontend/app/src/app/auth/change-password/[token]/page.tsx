'use client';
import { Alert } from '@/components/Alert';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { ChangePasswordDto } from '@/interfaces/auth.interface';
import { changePassword, confirmEmail, loginWithToken } from '@/services/fetchers';
import { Button, Input } from '@nextui-org/react';
import { FormikHelpers, useFormik } from 'formik';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';


const ValidationSchema = Yup.object().shape({
    password: Yup.string()
        .min(2, 'Contraseña Demasiado corta')
        .max(50, 'Contraseña Demasiado larga')
        .required('Por favor ingrese una contraseña'),
    password2: Yup.string()
        .min(2, 'Contraseña Demasiado corta')
        .max(50, 'Contraseña Demasiado larga')
        .equals([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Por favor repita la contraseña'),
});

interface Values {
    password: string;
    password2: string;
}


const RecoverPasswordPage = () => {
    const { token } = useParams();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [password1Visible, setPassword1Visible] = useState<boolean>(false);
    const [password2Visible, setPassword2Visible] = useState<boolean>(false);

    const handleChangePassword = async (changePasswordDto: ChangePasswordDto) => {
        try {
            await loginWithToken(token);
            await changePassword(token, changePasswordDto);
            enqueueSnackbar('¡Contraseña actualizada correctamente!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
            router.push("/admin");
        } catch (error) {
            enqueueSnackbar('ERROR: Error al actualizar contraseña', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
        }
    }

    const formik = useFormik({
        initialValues: {
            password: '',
            password2: '',
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const changePasswordDto: ChangePasswordDto = {
                newPassword: values.password,
            };
            handleChangePassword(changePasswordDto);
        },
    });

    if (!token) {
        return (
            <section
                id='authentication-layout-recover-password'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="ERROR: Error al validar token..." className="text-center" />
                <div>
                    <Link
                        href="/auth/recover-password"
                        className='text-blue-700 dark:text-light dark:hover:text-blue-400'
                    >
                        REINTENTAR
                    </Link>
                </div>
            </section>
        );
    } else {
        return (
            <section
                id='authentication-layout-recover-password'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="Actualizar contraseña" className="text-center" />

                <form onSubmit={formik.handleSubmit} className="w-full px-5 xl:px-20 space-y-2">
                    <Alert severity="info">
                        <p>Por favor ingresa una nueva contraseña</p>
                    </Alert>

                    <Input
                        // Value
                        type={password1Visible ? "text" : "password"}
                        id="password"
                        name="password"
                        label="Nueva contraseña"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.password && Boolean(formik.errors.password)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.password && formik.errors.password}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        // Password toggle
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={() => setPassword1Visible(!password1Visible)}>
                                {password1Visible ? (
                                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Input
                        // Value
                        type={password2Visible ? "text" : "password"}
                        id="password2"
                        name="password2"
                        label="Repetir contraseña"
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.password2 && Boolean(formik.errors.password2)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.password2 && formik.errors.password2}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        // Password toggle
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={() => setPassword2Visible(!password2Visible)}>
                                {password2Visible ? (
                                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Button
                        type="submit"
                        color="primary"
                        radius="sm"
                        className="w-full uppercase"
                    >
                        Actualizar contraseña
                    </Button>
                    <div>
                        <Link
                            href="/auth/login"
                            className='text-dark dark:text-light hover:text-blue-700 dark:hover:text-blue-400'
                        >
                            ¿Ya recordaste tu contraseña? Iniciá sesión
                        </Link>
                    </div>
                </form>
            </section>
        );
    }

};

export default RecoverPasswordPage;
