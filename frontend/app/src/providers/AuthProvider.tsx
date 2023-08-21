"use client";
import { CreateUserDto, User } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import { getAuthUser, registerUser, login, logout } from "@/services/fetchers";
import { LoginUserDto } from "@/interfaces/auth.interface";
import { useRouter, useSearchParams } from 'next/navigation';
import Axios from 'axios';
import { useSnackbar } from 'notistack';


type AuthContextType = {
    status: "authenticated" | "unauthenticated" | "loading";
    user: User | null;
    register: (data: CreateUserDto, formikSetFieldErrors: any) => void;
    login: (data: LoginUserDto) => void;
    logout: () => void;
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
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
    const [user, setUser] = useState<User | null>(null);

    const handleRegister = async (data: CreateUserDto, formikSetFieldErrors: any) => {
        console.log('Registrando usuario...', { data });

        try {
            await registerUser(data);
            console.log('Registro realizado correctamente');
            enqueueSnackbar('¡Usuario registrado correctamente!', {
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                variant: 'success',
            });
            const user: User = await getAuthUser();
            console.log({ user });
            setUser(user);
            setStatus("authenticated");
            console.log(searchParams.get('next'));
            const nextRoute: string | null = searchParams.get('next');
            if (nextRoute) router.push(nextRoute);
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

    const handleLogin = async (data: LoginUserDto) => {
        console.log('Iniciando sesión..', { data });

        try {
            await login(data);
            console.log('Sesión iniciada correctamente');
            const user: User = await getAuthUser();
            console.log({ user });
            setUser(user);
            setStatus("authenticated");
            console.log(searchParams.get('next'));
            const nextRoute: string | null = searchParams.get('next');
            if (nextRoute) router.push(nextRoute);
        } catch (error) {
            setStatus("unauthenticated");
            console.log('ERROR al iniciar sesion');
        }
    };

    const handleLogout = async () => {
        console.log('Cerrando sesión...');

        try {
            const response = await logout();
            setStatus("unauthenticated");
            setUser(null);
            console.log('Sesion cerrada correctamente');
            const nextRoute: string | null = searchParams.get('next');
            if (nextRoute) router.push(nextRoute);
            else router.push("/garden")
        } catch (error) {
            setStatus("unauthenticated");
            console.log('ERROR al cerrar sesión');
        }
    };

    const hasRole = (rolesPermitidos: string[]): boolean => {
        return user ? rolesPermitidos.indexOf(String(user.role)) > -1 : false;
    };

    const validateSession = async () => {
        console.log("Validando último token...");

        try {
            const user: User = await getAuthUser();
            setStatus("authenticated");
            setUser(user);
            console.log("Sesion válida");
        } catch (e) {
            setStatus("unauthenticated");
            console.log('Sesion expirada...');
        }
    }

    useEffect(() => {
        validateSession()
    }, []);

    return (
        <AuthContext.Provider
            value={{
                status: status,
                user: user,
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
