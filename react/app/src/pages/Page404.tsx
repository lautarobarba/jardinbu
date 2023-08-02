import { useRouteError, useLocation, Navigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { PageSubTitle } from "../components/PageSubTitle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserIsAuthenticated } from "../features/auth/authHooks";

export const Page404 = () => {
  const error = useRouteError();
  if (error) console.error(error);

  const location = useLocation();

  const [ redirect, setRedirect ] = useState<boolean>(false);
  const isAuthenticated = useUserIsAuthenticated();
  
  // Redirecciono al usuario luego de 5 segundos
  useEffect(() => {
    setTimeout(() => {
      handleRedirect();
    }, 3000);
  }, []);

  const handleRedirect = () => {
    setRedirect(true);
  }

  if(redirect){
    if(isAuthenticated)
      return (<Navigate to="/app/admin" replace state={{ location }}/>); 
    return (<Navigate to="/app" replace state={{ location }}/>); 
  }

  return (
    <>
      <div style={{ minHeight: "100px" }}></div>
      {/* TODO: Reemplazar icono por una imagen del jardin */}
      <FontAwesomeIcon
        icon={faGear}
        className="w-100 text-center"
        style={{ height: "200px" }}
      />
      <PageTitle title="Error 404 (REACTAPP)" />
      <PageSubTitle className="text-center" title="Página no encontrada" />
      <div className="w-100 text-center">
        <p><Link to={"/app/admin"}>Volver al Dashboard</Link></p>
        <p><Link to={"/app"}>Volver al Inicio</Link></p>
        <br />
        <p>Será redireccionado automáticamente en 3 segundos...</p>
      </div>
    </>
  );
}
