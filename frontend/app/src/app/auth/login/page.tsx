"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";
import { LoginUserDto } from "@/interfaces/auth.interface";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";

const LoginPage = () => {

    const { user, status, login, logout } = useContext(AuthContext);

    const [loginData, setLoginData] = useState<LoginUserDto>({
        email: 'usuarioprueba@gmail.com',
        password: 'usuarioprueba',
    })

    const handleLogin = () => {
        login(loginData);
    }

    return (
        <LogoutRequiredPageWrapper>
            <section
                id='authentication-layout'
                className="min-vh-100 d-flex"
            >
                <h1>LOGINPAGE</h1>
                <Link href="/auth/register" className="inline-flex items-center font-medium text-primary-800 bg-primary-100 px-2 rounded-lg hover:underline ">
                    IR AL REGISTRO
                </Link>
            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default LoginPage;
