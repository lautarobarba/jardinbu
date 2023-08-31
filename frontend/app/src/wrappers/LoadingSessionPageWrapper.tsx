"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { redirect, usePathname, useRouter } from 'next/navigation'
import { LoadingPageWrapper } from "./LoadingPageWrapper";

type LoadingSessionPageWrapperProps = {
  children?: ReactNode;
};

export const LoadingSessionPageWrapper = (props: LoadingSessionPageWrapperProps) => {
  const { children } = props;
  const { status } = useContext(AuthContext);

  if (status === 'loading') return <LoadingPageWrapper keepLoading={true} />;
  else return (<>{children}</>);
}
