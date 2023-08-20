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
            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default LoginPage;
