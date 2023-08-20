"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";
import { CreateUserDto } from "@/interfaces/user.interface";
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { FormikHelpers, useFormik } from 'formik';
import { PageTitle } from "@/components/PageTitle";


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
    const { enqueueSnackbar } = useSnackbar();

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
            register(createUserDto);
        },
    });

    return (
        <LogoutRequiredPageWrapper>
            <section
                id='authentication-layout'
                className="min-vh-100 d-flex"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5" />

            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default RegisterPage;
