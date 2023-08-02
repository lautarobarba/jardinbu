import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { PageSubTitle } from "../components/PageSubTitle";
import { PageTitle } from "../components/PageTitle";
import { useAppDispatch } from "../redux/hooks";
import { useConfirmEmail, useGetAuthUser } from "../api/hooks";
import Axios from 'axios';
import { useQueryClient } from "@tanstack/react-query";
import { setCredentials } from "../features/auth/authSlice";
import { useCurrentSession } from "../features/auth/authHooks";


export const ConfirmEmailPage = () => {

  const [ redirect, setRedirect ] = useState<boolean>(false);
  const location = useLocation();

  // Tengo que recuperar el token de la url y con eso verificar el correo
  const { token } = useParams();
  console.log(token);

  const currentSession = useCurrentSession();

  const { 
    mutate,
    isLoading: useConfirmEmailIsLoading,
    isSuccess: useConfirmEmailIsSuccess,
    isError: useConfirmEmailIsError,
    // error
  } = useConfirmEmail();

  const {
    // isLoading: getAuthUserIsLoading,
    data: getAuthUserData,
    isSuccess: getAuthUserIsSuccess,
    // isError: getAuthUserIsError,
    // error: getAuthUserError 
  } = useGetAuthUser(token ?? '', {
    enabled: useConfirmEmailIsSuccess
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(token){
      mutate(token ,{
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
  }, [token, mutate]);
  
  // Cuando el usuario confirmo su correo tengo que actualizar los datos del usuario logueado
  useEffect(() => {
    if(useConfirmEmailIsSuccess && getAuthUserIsSuccess){
      // console.log('Actualizar REDUX userSlice')
      // console.log({
      //   status: 'SUCCESS',
      //   user: getAuthUserData,
      //   session: session
      // });
  
      dispatch(setCredentials({
        user: getAuthUserData,
        session: currentSession
      }));

      // Enable redirect
      setRedirect(true);
    }
  }, [useConfirmEmailIsSuccess, getAuthUserIsSuccess]);

  if(redirect){
    return (<Navigate to="/app/admin" replace state={{ location }}/>); 
  }

  return (
    <>
      {/* Título de la página */}
      <Helmet>
        <title>Confirmando correo electrónico</title>
      </Helmet>

      {/* Contenido de la página */}
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ maxWidth: '85%' }}>
          <PageTitle title="Biblioteca del bosque" className="mt-5"/>
          <PageSubTitle title="Confirmando correo electrónico..." className="text-center"/>
        </div>
      </div>
    </>
  );
}
