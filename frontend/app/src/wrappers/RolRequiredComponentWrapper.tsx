"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'


type RolRequiredComponentWrapperProps = {
  children?: ReactNode;
  roles: string[];
};

export const RolRequiredComponentWrapper = (props: RolRequiredComponentWrapperProps) => {
  const { children, roles } = props;
  // const { status, role } = useContext(AuthContext);
  const { status } = useContext(AuthContext);
  const pathname = usePathname();

  // TODO: Check rol required: if roles.include(role) render children else NOTHING

  if (status === 'loading') return <p>Recuperando sesión...</p>;
  else return <>{children}</>
}
