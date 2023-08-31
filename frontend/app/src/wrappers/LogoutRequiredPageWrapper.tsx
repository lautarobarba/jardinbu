"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { redirect } from 'next/navigation'
import { LoadingPageWrapper } from "./LoadingPageWrapper";

type LogoutRequiredPageWrapperProps = {
  children?: ReactNode;
};

export const LogoutRequiredPageWrapper = (props: LogoutRequiredPageWrapperProps) => {
  const { children } = props;
  const { status } = useContext(AuthContext);

  const redirectDashboard = () => {
    console.log('Usuario loggeado. Redireccionando...');
    redirect(`/admin`);
  }

  if (status === 'authenticated') redirectDashboard();
  else return (<>{children}</>);
}
