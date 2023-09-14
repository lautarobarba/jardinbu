"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";
import { LoginUserDto, RecoverPasswordDto } from "@/interfaces/auth.interface";
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Button, Input } from "@nextui-org/react";
import { Alert } from "@/components/Alert";
import { sendRecoverPasswordEmail } from "@/services/fetchers";
import { useSnackbar } from "notistack";
import Axios from 'axios';

const ValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('El email no es válido')
        .required('Por favor, ingrese una cuenta de correo'),
});

interface Values {
    email: string;
}

const RecoverPasswordPage = () => {
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const recoverPasswordDto: RecoverPasswordDto = {
                email: values.email,
            };
            try {
                await sendRecoverPasswordEmail(recoverPasswordDto);
                console.log('Email de recuperación enviado correctamente');
                enqueueSnackbar("¡Email de recuperación enviado correctamente!", {
                    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                    variant: 'success',
                });
                setEmailSent(true);
            } catch (error) {
                console.log('ERROR al enviar email de recuperación');
                enqueueSnackbar('ERROR: Error enviar email de recuperación.', {
                    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                    variant: 'error',
                });
                if (Axios.isAxiosError(error)) {
                    const errorCode = error.response?.status;
                    if (Number(errorCode) === 404) {
                        setErrors({
                            email: 'La cuenta no existe',
                        });
                    }
                }
            }
        },
    });

    return (
        <LogoutRequiredPageWrapper>
            <section
                id='authentication-layout-recover-password'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="Recuperar contraseña" className="text-center" />

                {!emailSent && (
                    <form onSubmit={formik.handleSubmit} className="w-full px-5 xl:px-20 space-y-2">
                        <Input
                            // Value
                            type="text"
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            // Validations
                            isRequired={true}
                            autoComplete="off"
                            validationState={
                                formik.touched.email && Boolean(formik.errors.email)
                                    ? 'invalid'
                                    : 'valid'
                            }
                            errorMessage={formik.touched.email && formik.errors.email}
                            // Style
                            fullWidth={true}
                            variant="bordered"
                            radius="sm"
                            className="text-dark dark:text-light"
                        />
                        <Button
                            type="submit"
                            color="primary"
                            radius="sm"
                            className="w-full uppercase"
                        >
                            Recuperar contraseña
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
                )}

                {emailSent && (
                    <>
                        <div className="p-5">
                            <Alert severity="success">
                                <p>Se ha enviado el email de recuperación a la casilla <strong>{formik.values.email}</strong>.</p>
                                <p>Por favor revisa tu casilla de entrada.</p>
                            </Alert>
                        </div>
                        <div>
                            <Link
                                href="/auth/login"
                                className='text-dark dark:text-light hover:text-blue-700 dark:hover:text-blue-400'
                            >
                                ¿Ya recordaste tu contraseña? Iniciá sesión
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default RecoverPasswordPage;
