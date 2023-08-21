"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";
import { LoginUserDto } from "@/interfaces/auth.interface";
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Button, Input } from "@nextui-org/react";


const ValidateEmailPage = () => {
    const { status, user } = useContext(AuthContext);

    const redirectToDashboard = () => {
        console.log('Usuario loggeado y correo validado. Redireccionando...');
        window.location.href = `/admin`;
    }

    const redirectToLogin = () => {
        console.log('Usuario no loggeado. Redireccionando...');
        window.location.href = `/auth/login`;
    }

    if (status === 'unauthenticated') redirectToLogin();
    if (status === 'authenticated' && user && user.isEmailConfirmed) redirectToDashboard();
    return (
        <section
            id='authentication-layout'
            className="w-screen md:w-full flex flex-col justify-center items-center"
        >
            <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
            <PageSubTitle title="Confirmación de correo electrónico" className="text-center" />

            <br />
            <p className="p-3 text-center"><strong className="text-danger">Antes de continuar debes validar tu cuenta de correo electrónico.</strong></p>
            <p className="p-3 text-center text-dark dark:text-light">Se ha enviado un correo a la casilla <strong>{user?.email}</strong>. Por favor verifica tu casilla de entrada.</p>

            <p
                className="p-3 text-center text-blue-700 dark:text-blue-400"
                style={{ cursor: 'pointer' }}
            // onClick={sendConfirmationEmail}
            >
                <em>Si no has recibido el email, pulsa aquí para que te enviemos otro.</em>
            </p>
        </section>
    );
};

export default ValidateEmailPage;
