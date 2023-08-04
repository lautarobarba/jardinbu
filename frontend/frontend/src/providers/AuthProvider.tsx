"use client";
import { User } from "@/interfaces/user.interface";
import { ReactNode, createContext, useEffect, useState } from "react";
import Axios from 'axios';
import { login } from "@/services/fetchers";
import { LoginUserDto } from "@/interfaces/auth.interface";

// Api Url
// const apiBaseUrl: string =
//     process.env.REACT_APP_APIURL ?? 'http://localhost:7000';
const apiBaseUrl: string = 'http://localhost';

// Client to fetch
const axiosClient = Axios.create({
    baseURL: `${apiBaseUrl}/api/`,
    timeout: 10 * 1000, // 10 sec
});

export type RegisterParams = {
    email: string;
    password: string;
}

type AuthContextType = {
    status: "authenticated" | "unauthenticated" | "loading";
    user: User | null;
    token: string | null;
    login: (data: LoginUserDto) => void;
    logout: () => void;
    refreshToken: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    status: "unauthenticated",
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    refreshToken: () => { },
});

type AuthProviderProps = {
    children?: ReactNode;
};

export const AuthProvider = (props: AuthProviderProps) => {
    const { children } = props;

    // const [theme, setTheme] = useState<"light" | "dark">("light");
    // const [loading, setLoading] = useState<boolean>(true);

    const handleLogin = async (data: LoginUserDto) => {
        console.log('INICIANDO session..', { data });

        try {
            const response = await login(data);
            console.log({ response });
            console.log('Sesion iniciada correctamente');
        } catch (e) {
            console.log('ERROR al iniciar sesion');
        }

        // console.log({ response });
        // const newValue: "light" | "dark" = theme === "light" ? "dark" : "light";
        // setTheme(newValue);
        // localStorage.setItem("theme", newValue);
    };

    // const changeTheme = (newValue: "light" | "dark") => {
    //     setTheme(newValue);
    //     localStorage.setItem("theme", newValue);
    // };

    // useEffect(() => {
    //     const lastTheme = localStorage.getItem("theme");
    //     if (lastTheme && (lastTheme === "light" || lastTheme === "dark"))
    //         setTheme(lastTheme);
    //     setLoading(false);
    // }, []);

    return (
        <AuthContext.Provider
            value={{
                status: "unauthenticated",
                user: null,
                token: null,
                login: handleLogin,
                logout: () => { console.log('saliendo...') },
                refreshToken: () => { },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
