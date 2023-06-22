import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  registerUser,
  login,
  logout,
  getAuthUser,
  getFamilies,
  sendEmailConfirmationEmail,
  confirmEmail,
  createFamily,
  getGenera,
  createGenus,
  getSpecies,
  createSpecies,
  getSpecimens,
  createSpecimen,
  updateUser,
  getFamily,
  updateFamily,
  deleteFamily,
  getGenus,
  getOneSpecies,
  getSpecimen,
  updateGenus,
  deleteGenus,
  updateSpecies,
  deleteSpecies,
  updateSpecimen,
  deleteSpecimen,
} from './services';
import { Pagination } from '../utils/iPagination';

// Mutations hooks ------------------------------------------------------------
// ## Users
export const useRegister = () => {
  return useMutation(registerUser);
};

export const useLogin = () => {
  return useMutation(login);
};

export const useUpdateUser = () => {
  return useMutation(updateUser);
};

export const useLogout = () => {
  return useMutation(logout);
};

export const useSendEmailConfirmationEmail = () => {
  return useMutation(sendEmailConfirmationEmail);
};

export const useConfirmEmail = () => {
  return useMutation(confirmEmail);
};

// ## Families
export const useCreateFamily = () => {
  return useMutation(createFamily);
};

export const useUpdateFamily = () => {
  return useMutation(updateFamily);
};

export const useDeleteFamily = () => {
  return useMutation(deleteFamily);
};

// ## Genera
export const useCreateGenus = () => {
  return useMutation(createGenus);
};

export const useUpdateGenus = () => {
  return useMutation(updateGenus);
};

export const useDeleteGenus = () => {
  return useMutation(deleteGenus);
};

// ## Species
export const useCreateSpecies = () => {
  return useMutation(createSpecies);
};

export const useUpdateSpecies = () => {
  return useMutation(updateSpecies);
};

export const useDeleteSpecies = () => {
  return useMutation(deleteSpecies);
};

// ## Species
export const useCreateSpecimen = () => {
  return useMutation(createSpecimen);
};

export const useUpdateSpecimen = () => {
  return useMutation(updateSpecimen);
};

export const useDeleteSpecimen = () => {
  return useMutation(deleteSpecimen);
};

// Queries hooks --------------------------------------------------------------
// ## Users
export const useGetAuthUser = (
  token: string,
  config?: Omit<
    UseQueryOptions<any, unknown, any, string[]>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(['auth-user'], () => getAuthUser(token), config);
};

// ## Families
export const useGetFamilies = (
  params: {
    pagination?: Pagination;
  },
  config?: any
) => {
  const { pagination } = params;
  return useQuery(['families', pagination], () => getFamilies(params), config);
};

export const useGetFamily = (params: { id: number }, config?: any) => {
  return useQuery([`family-${params.id}`], () => getFamily(params), config);
};

// ## Genera
export const useGetGenera = (
  params: {
    pagination?: Pagination;
  },
  config?: any
) => {
  const { pagination } = params;
  return useQuery(['genera', pagination], () => getGenera(params), config);
};

export const useGetGenus = (params: { id: number }, config?: any) => {
  return useQuery([`genus-${params.id}`], () => getGenus(params), config);
};

// ## Species
export const useGetSpecies = (
  params: {
    pagination?: Pagination;
  },
  config?: any
) => {
  const { pagination } = params;
  return useQuery(['species', pagination], () => getSpecies(params), config);
};

export const useGetOneSpecies = (params: { id: number }, config?: any) => {
  return useQuery(
    [`species-${params.id}`],
    () => getOneSpecies(params),
    config
  );
};

// ## Specimens
export const useGetSpecimens = (
  params: {
    pagination?: Pagination;
  },
  config?: any
) => {
  const { pagination } = params;
  return useQuery(
    ['specimens', pagination],
    () => getSpecimens(params),
    config
  );
};

export const useGetSpecimen = (params: { id: number }, config?: any) => {
  return useQuery([`specimen-${params.id}`], () => getSpecimen(params), config);
};
