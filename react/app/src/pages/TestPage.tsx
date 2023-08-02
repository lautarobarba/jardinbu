import { useMutation, useQuery } from "@tanstack/react-query";
import Axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { LoginUserDto } from '../interfaces/LoginUserDto';
import { SessionDto } from "../interfaces/SessionDto";
import { User } from "../interfaces/User";
import { useGetAuthUser, useLogin } from '../api/hooks';

export const TestPage = () => {

  const loginUserDto: LoginUserDto = {
    email: 'usuarioprueba@gmail.com',
    password: 'usuarioprueba'
  };

  const [ userToken, setUserToken ] = useState<string>('');

  const { 
    mutate: loginMutate,
    isLoading: loginIsLoading,
    isSuccess: loginIsSuccess,
    isError: loginIsError,
    error: loginError
  } = useLogin();
  
  const {     
    isLoading: getAuthUserIsLoading,
    data: getAuthUserData,
    isSuccess: getAuthUserIsSuccess,
    isError: getAuthUserIsError,
    error: getAuthUserError 
  } = useGetAuthUser(userToken ,{
    enabled: loginIsSuccess
  });


  useEffect(() => {
    // console.log('Componente renderizado');
    // tryLogin(loginUserDto);
    loginMutate(loginUserDto, {
      onSuccess: (data: SessionDto) => {
        console.log(data);
        console.log(data.accessToken);
        console.log(data.refreshToken);
        setUserToken(data.accessToken);
      },
      onError: (error) => {
        if(Axios.isAxiosError(error)){
          console.log('>>axiosError');
          console.log(error.response?.status);
        }
      }
    });
  }, []);

  if(loginIsSuccess){
    console.log('Buscando datos del usuario...');
    // const user: User = getUser.data;
    if(getAuthUserIsSuccess) {
      console.log(getAuthUserData);
    } else {
      console.log(getAuthUserError);
    }
  }

  return (
    <div>
      <h1 className="text">Test</h1>
      { loginIsLoading && <p>Enviando...</p>}
      { loginIsSuccess && <p>Ingresado correctamente</p>}
      { loginIsError && <p>ERROR</p>}
    </div>
  );
};
