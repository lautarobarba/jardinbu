"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";
import { CreateUserDto } from "@/interfaces/user.interface";
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Button, Input } from "@nextui-org/react";


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

const RegisterPage = () => {
    const { register } = useContext(AuthContext);

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
            register(createUserDto, setErrors);
        },
    });

    return (
        <LogoutRequiredPageWrapper>
            <section
                id='authentication-layout'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="Crear cuenta" className="text-center" />

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
                    <Input
                        // Value
                        type="text"
                        id="firstname"
                        name="firstname"
                        label="Nombre"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.firstname && Boolean(formik.errors.firstname)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.firstname && formik.errors.firstname}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    />
                    <Input
                        // Value
                        type="text"
                        id="lastname"
                        name="lastname"
                        label="Apellido"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.lastname && Boolean(formik.errors.lastname)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.lastname && formik.errors.lastname}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    />
                    <Input
                        // Value
                        type="password"
                        id="password"
                        name="password"
                        label="Contraseña"
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
                    />
                    <Input
                        // Value
                        type="password"
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
                    />
                    <Button
                        type="submit"
                        color="primary"
                        radius="sm"
                        className="w-full uppercase"
                    >
                        Registrarse
                    </Button>
                    <div>
                        <Link
                            href="/auth/login"
                            className='text-dark dark:text-light hover:text-blue-700 dark:hover:text-blue-400'
                        >
                            ¿Ya tenés cuenta? Iniciá sesión
                        </Link>
                    </div>
                </form>
            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default RegisterPage;
