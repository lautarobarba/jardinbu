"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'

type LogoutRequiredPageWrapperProps = {
  children?: ReactNode;
};

export const LogoutRequiredPageWrapper = (props: LogoutRequiredPageWrapperProps) => {
  const { children } = props;
  const { status } = useContext(AuthContext);

  const redirectDashboard = () => {
    console.log('Usuario loggeado. Redireccionando...');
    window.location.href = `/admin`;
  }

  if (status === 'loading') return <p>Recuperando sesión...</p>;
  if (status === 'authenticated') redirectDashboard();
  else return (<>{children}</>);
}
