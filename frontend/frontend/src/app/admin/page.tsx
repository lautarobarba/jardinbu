'use client';
import { useContext, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";

const AdminDashboard = () => {
  const { status } = useContext(AuthContext);

  const redirectToLogin = () => {
    console.log('Usuario no loggeado. Redireccionando...');
    window.location.href = "/auth/login"
  }

  useEffect(() => {
    console.log({ status });
    if (status) {
      redirectToLogin();
    }
  }, [status]);

  return (
    <>
      <br />
      <h1 className="text-center">{"[[ AdminDashboard ]]"}</h1>
      <div className="flex flex-col flex-nowrap justify-center">
        <hr className="m-auto w-80" />
      </div>
      <Link href="/" className="ml-5 text-blue-500">
        {">>"} Volver ◀️
      </Link>

      <hr />

      {/* {session.status === 'loading' &&
        <p>BUSCANDO DATOS DEL USUARIO...</p>
      }
      {session.status === 'authenticated' && (
        <>
          <h1>Usuario loggeado</h1>
          <pre>{JSON.stringify(session)}</pre>
        </>
      )} */}
    </>
  );
};

export default AdminDashboard;
