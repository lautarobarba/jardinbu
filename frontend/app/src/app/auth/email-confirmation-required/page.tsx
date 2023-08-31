"use client";
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Button } from "@nextui-org/react";
import { sendEmailConfirmationEmail } from "@/services/fetchers";
import { useSnackbar } from 'notistack';
import { redirect } from "next/navigation";
import { LoginRequiredPageWrapper } from "@/wrappers/LoginRequiredPageWrapper";


const EmailConfirmationRequiredPage = () => {
    const { status, user, logout } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();

    const handleSendEmailConfirmationEmail = async () => {
        try {
            await sendEmailConfirmationEmail();
            console.log('Email de validación enviado correctamente');
            enqueueSnackbar("¡Email de validación enviado correctamente!", {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
        } catch (error) {
            console.log('ERROR al enviar email de validación');
            enqueueSnackbar('ERROR: Error enviar email de validación.', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
        }
    }

    const handleLogoutAndRedirectToRegister = () => {
        console.log('Usuario deslogueado. Redireccionando...');
        logout({ redirectHREF: '/auth/register' });
    }

    const redirectToDashboard = () => {
        console.log('Usuario loggeado y correo validado. Redireccionando...');
        redirect('/admin');
    }

    const redirectToLogin = () => {
        console.log('Usuario no loggeado. Redireccionando...');
        redirect('/auth/login');
    }

    if (status === 'unauthenticated') redirectToLogin();
    if (status === 'authenticated' && user && user.isEmailConfirmed) redirectToDashboard();
    return (
        <section
            id='authentication-layout-email-confirm-required'
            className="w-screen md:w-full flex flex-col justify-center items-center"
        >
            <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
            <PageSubTitle title="Confirmación de correo electrónico" className="text-center" />

            <br />
            <p className="p-3 text-center"><strong className="text-danger">Antes de continuar debes validar tu cuenta de correo electrónico.</strong></p>
            <p className="p-3 text-center text-dark dark:text-light">Se ha enviado un correo a la casilla <strong>{user?.email}</strong>.<br />Por favor verifica tu casilla de entrada.</p>

            <p
                className="p-3 text-center text-blue-700 dark:text-blue-400"
                style={{ cursor: 'pointer' }}
                onClick={handleSendEmailConfirmationEmail}
            ><em>Si no has recibido el email, pulsa aquí para que te enviemos otro.</em></p>

            <Button
                type="button"
                onClick={handleSendEmailConfirmationEmail}
            >Reenviar correo de verificación</Button>

            <br />
            <br className="md:hidden" />
            <br className="md:hidden" />
            <br className="md:hidden" />
            <p
                className="p-3 text-center text-sm text-gray-600 dark:text-gray-300"
                style={{ cursor: 'pointer' }}
                onClick={handleLogoutAndRedirectToRegister}
            >
                <em>Si tu correo electrónico es incorrecto haz click aqui para registrarte nuevamente con un correo electrónico válido.</em>
            </p>
        </section>
    );
};

export default EmailConfirmationRequiredPage;
