"use client";
import { ReactNode, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { redirect, useSearchParams } from 'next/navigation';

type LogoutRequiredPageWrapperProps = {
  children?: ReactNode;
};

export const LogoutRequiredPageWrapper = (props: LogoutRequiredPageWrapperProps) => {
  const { children } = props;
  const { status } = useContext(AuthContext);
  // const searchParams = useSearchParams();
  // const [nextRoute, setNextRoute] = useState<string>("/admin");


  const redirectDashboard = () => {
    console.log('Usuario loggeado. Redireccionando...');
    redirect('/admin');
  }

  // useEffect(() => {
  //   setNextRoute(searchParams.get('next') ?? '/admin');
  // }, []);

  if (status === 'authenticated') redirectDashboard();
  else return (<>{children}</>);
}
