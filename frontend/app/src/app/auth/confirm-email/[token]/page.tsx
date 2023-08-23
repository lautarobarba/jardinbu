'use client';
import { confirmEmail, loginWithToken } from '@/services/fetchers';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ConfirmEmailPage = async () => {
    const router = useRouter();
    const { token } = useParams();

    // const verifyToken = async () => {
    //     if (token) {
    //         // Validate token
    //         console.log({ token })
    //         try {
    //             await confirmEmail(token);
    //             await loginWithToken(token);
    //             router.push("/admin");
    //         } catch (error) {
    //             // Error on token
    //             router.push("/auth/email-confirmation-required");
    //         }
    //     } else {
    //         // Error on token
    //         router.push("/auth/email-confirmation-required");
    //     }
    // }

    // useEffect(() => {
    //     verifyToken();
    // }, []);

    return <p>ConfirmEmailPage</p>;
};

export default ConfirmEmailPage;
