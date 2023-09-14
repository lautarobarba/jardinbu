"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { redirect, usePathname } from 'next/navigation';
import { Status } from "@/interfaces/user.interface";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const AccountDisabledPage = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  }

  return (
    <section id="account-disabled" className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center flex flex-col">
          <div className="text-center">
            <img
              loading='lazy'
              alt="logo-jbu"
              title="logo-jbu"
              src="/assets/images/access_denied.svg"
              width={200}
              height={200}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
              className="m-auto mb-4"
            />
          </div>

          <h1 className="text-xl tracking-tight font-extrabold text-dark">
            Jardín Botánico de Ushuaia
          </h1>
          <br />
          <h2 className="text-error italic text-xl">
            Su cuenta se encuentra deshabilitada.
            <br />
            Por favor comuníquese con un administrador.
          </h2>
          <br />

          <div className="w-full">
            <Button color="primary" radius="sm" className="uppercase" onClick={handleLogout}>
              Salir
            </Button>
          </div>

          <Link href="/garden" className="w-full mt-2">
            <Button color="primary" radius="sm" className="uppercase">
              Volver a la biblioteca
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

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
  if (user && user.status === Status.INACTIVE) return <AccountDisabledPage />;
  else return (<>{children}</>);
}
