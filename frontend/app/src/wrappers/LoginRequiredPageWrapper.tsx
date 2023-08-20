"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'

const ValidateEmailPage = () => {
  return (
    <><p>POR FAVOR FALTA VALIDAR EL EMAIL...</p></>
  );
}

type LoginRequiredPageWrapperProps = {
  children?: ReactNode;
};

export const LoginRequiredPageWrapper = (props: LoginRequiredPageWrapperProps) => {
  const { children } = props;
  const { status } = useContext(AuthContext);
  const pathname = usePathname()

  const redirectToLogin = () => {
    console.log('Usuario no loggeado. Redireccionando...');
    window.location.href = `/auth/login?next=${pathname}`
  }

  if (status === 'loading') return <p>Recuperando sesión...</p>;
  if (status === 'unauthenticated') redirectToLogin();
  // TODO: CHECK IN USER IF EMAIL IS VALIDATED OTHERWISE PRINT VALIDATE EMAIL PAGE
  else return (<>{children}</>);
}
