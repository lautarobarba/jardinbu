"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { redirect, usePathname, useRouter } from 'next/navigation'

type LoginRequiredPageWrapperProps = {
  children?: ReactNode;
};

export const LoginRequiredPageWrapper = (props: LoginRequiredPageWrapperProps) => {
  const { children } = props;
  const { status, user } = useContext(AuthContext);
  const pathname = usePathname()

  const redirectToLogin = () => {
    console.log('Usuario no loggeado. Redireccionando...');
    redirect(`/auth/login?next=${pathname}`);
  }

  const redirectToValidateEmail = () => {
    console.log('Correo no válidado. Redireccionando...');
    redirect(`/auth/email-confirmation-required?next=${pathname}`);
  }

  if (status === 'unauthenticated') redirectToLogin();
  if (user && !user.isEmailConfirmed) redirectToValidateEmail();
  else return (<>{children}</>);
}
