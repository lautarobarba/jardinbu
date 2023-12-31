"use client";
import { CreateUserDto, User } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import { registerUser, login, logout } from "@/services/fetchers";
import { useGetAuthUser } from "@/services/hooks";
import { LoginUserDto } from "@/interfaces/auth.interface";
import { redirect, useRouter } from 'next/navigation';
import Axios from 'axios';
import { useSnackbar } from 'notistack';

type AuthContextType = {
    status: "authenticated" | "unauthenticated" | "loading";
    user: User | null;
    register: (data: CreateUserDto, formikSetFieldErrors: any) => void;
    login: (data: LoginUserDto, formikSetFieldErrors: any) => void;
    logout: (params?: { redirectHREF?: string }) => void;
    hasRole: (roles: string[]) => boolean;
};

export const AuthContext = createContext<AuthContextType>({
    status: "loading",
    user: null,
    register: () => { },
    login: () => { },
    logout: () => { },
    hasRole: ([]) => false,
});

type AuthProviderProps = {
    children?: ReactNode;
};

export const AuthProvider = (props: AuthProviderProps) => {
    const { children } = props;
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    // Queries
    const {
        data: authUser,
        isSuccess: authUserIsSuccess,
        isError: authUserIsError,
        isLoading: authUserIsLoading,
        refetch: refetchAuthUser
    } = useGetAuthUser({ retry: 1 });
    const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

    const handleRegister = async (data: CreateUserDto, formikSetFieldErrors: any) => {
        console.log('Registrando usuario...', { data });

        try {
            await registerUser(data);
            console.log('Usuario registrado correctamente');
            enqueueSnackbar('¡Usuario registrado correctamente!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
            refetchAuthUser();
            setStatus("authenticated");
        } catch (error) {
            setStatus("unauthenticated");
            console.log('ERROR al registrar usuario');
            enqueueSnackbar('ERROR: Error al registrar usuario.', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
            if (Axios.isAxiosError(error)) {
                const errorCode = error.response?.status;
                if (Number(errorCode) === 409) {
                    formikSetFieldErrors({
                        email: 'Este email ya se encuentra registrado',
                    })
                }
            }
        }
    };

    const handleLogin = async (data: LoginUserDto, formikSetFieldErrors: any) => {
        console.log('Iniciando sesión..', { data });

        try {
            await login(data);
            console.log('Sesión iniciada correctamente');
            enqueueSnackbar('¡Sesión iniciada correctamente!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
            refetchAuthUser();
            setStatus("authenticated");
        } catch (error) {
            setStatus("unauthenticated");
            console.log('ERROR al iniciar sesión');
            enqueueSnackbar('ERROR: Error al iniciar sesión.', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'error',
            });
            if (Axios.isAxiosError(error)) {
                const errorCode = error.response?.status;
                if (Number(errorCode) === 404) {
                    formikSetFieldErrors({
                        email: 'La cuenta no existe',
                    });
                } else if (Number(errorCode) === 401) {
                    formikSetFieldErrors({
                        password: 'Contraseña incorrecta',
                    });
                }
            }
        }
    };

    const handleLogout = async (params?: { redirectHREF?: string }) => {
        console.log('Cerrando sesión...');

        try {
            await logout();
            console.log('Sesion cerrada correctamente');
            setStatus("unauthenticated");
        } catch (error) {
            setStatus("unauthenticated");
            console.log('ERROR al cerrar sesión');
        }
    };

    const hasRole = (rolesPermitidos: string[]): boolean => {
        return authUser ? rolesPermitidos.indexOf(String(authUser.role)) > -1 : false;
    };

    useEffect(() => {
        if (authUserIsSuccess) setStatus("authenticated");
        else if (authUserIsError) setStatus("unauthenticated");
    }, [authUserIsSuccess, authUserIsError]);

    return (
        <AuthContext.Provider
            value={{
                status: status,
                user: authUser ? authUser : null,
                register: handleRegister,
                login: handleLogin,
                logout: handleLogout,
                hasRole: hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
