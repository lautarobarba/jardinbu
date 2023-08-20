"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'


const RolRequiredMessage = () => {
  return (
    <>
      <p>PERMISSOS INSUFICIENTES FALTA ROL.</p>
    </>
  );
}

type RolRequiredPageWrapperProps = {
  children?: ReactNode;
  roles: string[];
};

export const RolRequiredPageWrapper = (props: RolRequiredPageWrapperProps) => {
  const { children, roles } = props;
  // const { status, role } = useContext(AuthContext);
  const { status } = useContext(AuthContext);
  const pathname = usePathname()

  // TODO: Check rol required: if roles.include(role) render children else rol RolRequiredMessage

  const redirectToLogin = () => {
    console.log('Usuario no loggeado. Redireccionando...');
    window.location.href = `/auth/login?next=${pathname}`
  }

  if (status === 'loading') return <p>Recuperando sesión...</p>;
  if (status === 'unauthenticated') redirectToLogin()
  else return <>{children}</>
}
