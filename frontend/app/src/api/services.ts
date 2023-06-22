import Axios from 'axios';
import { CreateUserDto } from '../interfaces/CreateUserDto';
import { LoginUserDto } from '../interfaces/LoginUserDto';
import { SessionDto } from '../interfaces/SessionDto';
import {
  CreateSpeciesDto,
  Species,
  UpdateSpeciesDto,
} from '../interfaces/SpeciesInterface';
import {
  CreateSpecimenDto,
  Specimen,
  UpdateSpecimenDto,
} from '../interfaces/SpecimenInterface';
import { UpdateUserDto } from '../interfaces/UpdateUserDto';
import { User } from '../interfaces/User';
import { PaginatedList, Pagination } from '../utils/iPagination';
import {
  Family,
  CreateFamilyDto,
  UpdateFamilyDto,
} from '../interfaces/FamilyInterface';
import {
  CreateGenusDto,
  Genus,
  UpdateGenusDto,
} from '../interfaces/GenusInterface';

// Api Url
const apiBaseUrl: string =
  process.env.REACT_APP_APIURL ?? 'http://localhost:7000';

// Client to fetch
const axiosClient = Axios.create({
  baseURL: `${apiBaseUrl}/api/`,
  timeout: 10 * 1000, // 10 sec
});

// # Mutations ----------------------------------------------------------------
// ## Users
export const registerUser = async (params: {
  createUserDto: CreateUserDto;
}): Promise<SessionDto> => {
  const { createUserDto } = params;
  return axiosClient
    .post('auth/register', createUserDto)
    .then((response) => response.data);
};

export const login = async (
  loginUserDto: LoginUserDto
): Promise<SessionDto> => {
  return axiosClient
    .post('auth/login', loginUserDto)
    .then((response) => response.data);
};

export const updateUser = async (params: {
  updateUserDto: UpdateUserDto;
  token: string;
}): Promise<User> => {
  const { updateUserDto, token } = params;
  console.log({
    MSG: 'AXIOS PATCH',
    updateUserDto,
  });
  return axiosClient
    .patch('user', updateUserDto, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data);
};

export const logout = async (token: string): Promise<void> => {
  return axiosClient
    .post('auth/logout', null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const sendEmailConfirmationEmail = async (
  token: string
): Promise<void> => {
  return axiosClient
    .post('auth/email-confirmation/send', null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const confirmEmail = async (token: string): Promise<void> => {
  return axiosClient
    .post('auth/email-confirmation/confirm', null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// ## Families
export const createFamily = async (params: {
  token: string;
  createFamilyDto: CreateFamilyDto;
}): Promise<Family> => {
  const { token, createFamilyDto } = params;
  return axiosClient
    .post('family', createFamilyDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const updateFamily = async (params: {
  token: string;
  updateFamilyDto: UpdateFamilyDto;
}): Promise<Family> => {
  const { token, updateFamilyDto } = params;
  return axiosClient
    .patch('family', updateFamilyDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const deleteFamily = async (params: {
  token: string;
  id: number;
}): Promise<void> => {
  const { token, id } = params;
  return axiosClient
    .delete(`family/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// ## Genera
export const createGenus = async (params: {
  token: string;
  createGenusDto: CreateGenusDto;
}): Promise<Genus> => {
  const { token, createGenusDto } = params;
  return axiosClient
    .post('genus', createGenusDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const updateGenus = async (params: {
  token: string;
  updateGenusDto: UpdateGenusDto;
}): Promise<Genus> => {
  const { token, updateGenusDto } = params;
  return axiosClient
    .patch('genus', updateGenusDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const deleteGenus = async (params: {
  token: string;
  id: number;
}): Promise<void> => {
  const { token, id } = params;
  return axiosClient
    .delete(`genus/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// ## Species
export const createSpecies = async (params: {
  token: string;
  createSpeciesDto: CreateSpeciesDto;
}): Promise<Species> => {
  const { token, createSpeciesDto } = params;
  return axiosClient
    .post('species', createSpeciesDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const updateSpecies = async (params: {
  token: string;
  updateSpeciesDto: UpdateSpeciesDto;
}): Promise<Species> => {
  const { token, updateSpeciesDto } = params;
  return axiosClient
    .patch('species', updateSpeciesDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const deleteSpecies = async (params: {
  token: string;
  id: number;
}): Promise<void> => {
  const { token, id } = params;
  return axiosClient
    .delete(`species/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// ## Specimens
export const createSpecimen = async (params: {
  token: string;
  createSpecimenDto: CreateSpecimenDto;
}): Promise<Specimen> => {
  const { token, createSpecimenDto } = params;
  return axiosClient
    .post('specimen', createSpecimenDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const updateSpecimen = async (params: {
  token: string;
  updateSpecimenDto: UpdateSpecimenDto;
}): Promise<Specimen> => {
  const { token, updateSpecimenDto } = params;
  return axiosClient
    .patch('specimen', updateSpecimenDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const deleteSpecimen = async (params: {
  token: string;
  id: number;
}): Promise<void> => {
  const { token, id } = params;
  return axiosClient
    .delete(`specimen/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// # Queries ------------------------------------------------------------------

// ## Users
export const getAuthUser = async (token: string): Promise<User> => {
  return axiosClient
    .get('auth/user', { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => response.data);
};

// ## Families
export const getFamilies = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Family>> => {
  const { pagination } = params;
  return axiosClient
    .get(`family`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getFamily = async (params: { id: number }): Promise<Family> => {
  const { id } = params;
  return axiosClient.get(`family/${id}`).then((response) => response.data);
};

// ## Genera
export const getGenera = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Genus>> => {
  const { pagination } = params;
  return axiosClient
    .get(`genus`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getGenus = async (params: { id: number }): Promise<Genus> => {
  const { id } = params;
  return axiosClient.get(`genus/${id}`).then((response) => response.data);
};

// ## Species
export const getSpecies = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Species>> => {
  const { pagination } = params;
  return axiosClient
    .get(`species`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getOneSpecies = async (params: {
  id: number;
}): Promise<Species> => {
  const { id } = params;
  return axiosClient.get(`species/${id}`).then((response) => response.data);
};

// ## Specimens
export const getSpecimens = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Specimen>> => {
  const { pagination } = params;
  return axiosClient
    .get(`specimen`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getSpecimen = async (params: {
  id: number;
}): Promise<Specimen> => {
  const { id } = params;
  return axiosClient.get(`specimen/${id}`).then((response) => response.data);
};
