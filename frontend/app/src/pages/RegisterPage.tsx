import { Helmet } from "react-helmet-async";
import { Link, Navigate, useLocation } from "react-router-dom";
import { PageSubTitle } from "../components/PageSubTitle";
import { PageTitle } from "../components/PageTitle";
import { useUserIsAuthenticated } from "../features/auth/authHooks";
import { RegisterForm } from "../forms/RegisterForm";

export const RegisterPage = () => {

  // Redirecciono si el usuario ya esta autenticado
  const isAuthenticated = useUserIsAuthenticated();
  const location = useLocation();
  
  if(isAuthenticated){
    return (<Navigate to="/app/admin" replace state={{ location }}/>); 
  }

  return (
    <>
      {/* Título de la página */}
      <Helmet>
        <title>Crear cuenta</title>
      </Helmet>

      {/* Contenido de la página */}
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ maxWidth: '85%' }}>
          <Link to={"/app"} className="text-dark">
            <PageTitle title="Biblioteca del bosque" className="mt-5"/>
          </Link>
          <PageSubTitle title="Crear cuenta" className="text-center"/>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
