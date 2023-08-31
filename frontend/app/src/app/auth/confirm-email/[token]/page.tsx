'use client';
import { PageSubTitle } from '@/components/PageSubTitle';
import { PageTitle } from '@/components/PageTitle';
import { confirmEmail, loginWithToken } from '@/services/fetchers';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

const ConfirmEmailPage = () => {
    const { token } = useParams();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const verifyToken = async () => {
        try {
            await loginWithToken(token);
            await confirmEmail(token);
            enqueueSnackbar('¡Correo validado correctamente!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
            router.push("/admin");
        } catch (error) {
            enqueueSnackbar('ERROR: Error al validado correo electrónico.', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
            router.push("/auth/email-confirmation-required");
        }
    }

    useEffect(() => {
        verifyToken();
    }, []);

    if (!token) {
        return (
            <section
                id='authentication-layout-confirm-email'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="ERROR: Error al validar token..." className="text-center" />
                <div>
                    <Link
                        href="/auth/email-confirmation-required"
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
                id='authentication-layout-confirm-email'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="Validando token..." className="text-center" />
                <PageSubTitle title="Por favor espere..." className="text-center" />
            </section>
        );
    }

};

export default ConfirmEmailPage;
