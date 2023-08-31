"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

type RolRequiredComponentWrapperProps = {
  children?: ReactNode;
  roles: string[];
};

export const RolRequiredComponentWrapper = (props: RolRequiredComponentWrapperProps) => {
  const { children, roles } = props;
  const { user } = useContext(AuthContext);


  if (user && roles.includes(user.role)) return <>{children}</>;
  else return null;
}
