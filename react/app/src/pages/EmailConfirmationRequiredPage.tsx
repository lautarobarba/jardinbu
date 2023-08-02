import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation } from "react-router";
import { useLogout, useSendEmailConfirmationEmail } from "../api/hooks";
import { PageSubTitle } from "../components/PageSubTitle";
import { PageTitle } from "../components/PageTitle";
import { removeCredentials, selectCurrentSession } from "../features/auth/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { useCurrentUser, useJwtToken, useUserIsAuthenticated } from "../features/auth/authHooks";
import Axios from 'axios';


export const EmailConfirmationRequiredPage = () => {
  const isAuthenticated = useUserIsAuthenticated();
  const jwtToken = useJwtToken();
  const location = useLocation();
  const user = useCurrentUser();

  const { 
    mutate,
    isLoading,
    isSuccess,
    isError,
    // error
  } = useSendEmailConfirmationEmail();

  const dispatch = useAppDispatch();

  const sendConfirmationEmail = () => {
    console.log('Enviando email de confirmacion.');
    if(jwtToken){
      mutate(jwtToken ,{
        onError: (error) => {
          // Esto solo lo uso para imprimir los errores en consola.
          if(Axios.isAxiosError(error)){
            console.log({
              error: error.response?.status,
              mensaje: error.response?.data.message
            });
          }
        },
        onSuccess: () => {
          // TODO: FALTA AGREGAR NOTIFICACION
          console.log('AVISAR CON UNA NOTIFICACION QUE SE ENVIO CORRECTAMENTE EL CORREO');
        }
      });
    } else {
      console.log({Error: 'Error', msg: 'jwtToken no existe'})
    }
  }
  
  // Valido si el usuario esta autenticado
  if(!isAuthenticated){
    return (<Navigate to="/app/auth/login" replace state={{ location }}/>); 
  }

  // Valido si el usuario confirmó su correo electrónico
  if(user && user.isEmailConfirmed){
    return (<Navigate to="/app/admin" replace state={{ location }}/>);
  }

  return (
    <>
      {/* Título de la página */}
      <Helmet>
        <title>Confirmación de correo electrónico</title>
      </Helmet>

      {/* Contenido de la página */}
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ maxWidth: '85%' }}>
          <PageTitle title="Biblioteca del bosque" className="mt-5"/>
          <PageSubTitle title="Confirmación de correo electrónico" className="text-center"/>
          <p><strong className="text-danger">Antes de continuar debes validar tu cuenta de correo electrónico.</strong></p>
          <p>Se ha enviado un correo a la casilla {user?.email}. Por favor verifica tu casilla de entrada.</p>
          <p 
            className="text-primary"
            style={{ cursor: 'pointer' }}
            onClick={sendConfirmationEmail}
          >
            <em>Si no has recibido el email, pulsa aquí para que te enviemos otro.</em>
          </p>
        </div>
      </div>
    </>
  );
}
