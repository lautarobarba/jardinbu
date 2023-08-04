"use client";
import { User } from "@/interfaces/UserInterface";
import { ReactNode, createContext, useEffect, useState } from "react";
import Axios from 'axios';
import { useLogin } from "@/services/hooks";
import { LoginUserDto } from "@/interfaces/LoginUserDto";

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

export type LoginParams = {
    email: string;
    password: string;
}

type AuthContextType = {
    status: "authenticated" | "unauthenticated" | "loading";
    user: User | null;
    token: string | null;
    login: (data: LoginParams) => void;
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

    const {
        data, mutate
    } = useLogin()
    // const [theme, setTheme] = useState<"light" | "dark">("light");
    // const [loading, setLoading] = useState<boolean>(true);

    const login = async (data: LoginParams) => {
        console.log('INICIANDO session..', { data });
        // TODO: falta agregar try/catch
        // const response = await axiosClient.post('auth/login', data);

        // mutate(data as LoginUserDto);

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
                login: login,
                logout: () => { },
                refreshToken: () => { },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
