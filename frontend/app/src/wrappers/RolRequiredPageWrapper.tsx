"use client";
import { ReactNode, useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import { Button } from "@nextui-org/react";

const RolRequiredPage = () => {
  return (
    <section id="rol-required" className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
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
            Usted no cuenta con los permisos necesarios para visitar esta página...
          </h2>
          <br />
          <Link href="/admin" className="w-full">
            <Button color="primary" radius="sm" className="uppercase">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

type RolRequiredPageWrapperProps = {
  children?: ReactNode;
  roles: string[];
};

export const RolRequiredPageWrapper = (props: RolRequiredPageWrapperProps) => {
  const { children, roles } = props;
  const { user } = useContext(AuthContext);


  if (user && roles.includes(user.role)) return <>{children}</>;
  else return <RolRequiredPage />;
}
