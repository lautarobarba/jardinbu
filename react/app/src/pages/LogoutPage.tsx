import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation } from "react-router";
import { useLogout } from "../api/hooks";
import { PageSubTitle } from "../components/PageSubTitle";
import { PageTitle } from "../components/PageTitle";
import { removeCredentials, selectCurrentSession } from "../features/auth/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { useJwtToken, useUserIsAuthenticated } from "../features/auth/authHooks";
import Axios from 'axios';


export const LogoutPage = () => {
  const isAuthenticated = useUserIsAuthenticated();
  const jwtToken = useJwtToken();
  const location = useLocation();

  const { 
    mutate: logoutMutate,
    isLoading: logoutIsLoading,
    isSuccess: logoutIsSuccess,
    isError: logoutIsError,
    // error: logoutError
  } = useLogout();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(isAuthenticated && jwtToken){
      logoutMutate(jwtToken ,{
        onError: (error) => {
          // Esto solo lo uso para imprimir los errores en consola.
          if(Axios.isAxiosError(error)){
            console.log({
              error: error.response?.status,
              mensaje: error.response?.data.message
            });
          }
        },
      });
    }
  }, [isAuthenticated, jwtToken, logoutMutate]);

  useEffect(() => {
    if(logoutIsSuccess || logoutIsError){
      dispatch(removeCredentials());
    }
  }, [logoutIsSuccess,  logoutIsError, dispatch]);
  
  if(!isAuthenticated){
    return (<Navigate to="/app" replace state={{ location }}/>); 
  }

  return (
    <>
      {/* Título de la página */}
      <Helmet>
        <title>Cerrar sesión</title>
      </Helmet>

      {/* Contenido de la página */}
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ maxWidth: '85%' }}>
          <PageTitle title="Biblioteca del bosque" className="mt-5"/>
          <PageSubTitle title="Cerrando sesión..." className="text-center"/>
        </div>
      </div>
    </>
  );
}
