import Axios from "axios";
import Cookies from "js-cookie";
import {
  Pagination,
  PaginatedList,
  PaginationSpecies,
} from "../interfaces/pagination.interface";
import {
  ChangePasswordDto,
  LoginUserDto,
  RecoverPasswordDto,
  SessionDto,
} from "../interfaces/auth.interface";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "../interfaces/user.interface";
import {
  CreateSpeciesDto,
  Species,
  UpdateSpeciesDto,
} from "../interfaces/species.interface";
import {
  CreateSpecimenDto,
  Specimen,
  UpdateSpecimenDto,
} from "../interfaces/specimen.interface";
import {
  Family,
  CreateFamilyDto,
  UpdateFamilyDto,
} from "../interfaces/family.interface";
import {
  CreateGenusDto,
  Genus,
  UpdateGenusDto,
} from "../interfaces/genus.interface";
import {
  CreateKingdomDto,
  Kingdom,
  UpdateKingdomDto,
} from "../interfaces/kingdom.interface";
import {
  CreatePhylumDto,
  Phylum,
  UpdatePhylumDto,
} from "../interfaces/phylum.interface";
import {
  ClassTax,
  CreateClassTaxDto,
  UpdateClassTaxDto,
} from "../interfaces/class-tax.interface";
import {
  CreateOrderTaxDto,
  OrderTax,
  UpdateOrderTaxDto,
} from "../interfaces/order-tax.interface";
import { CreateTagDto, Tag, UpdateTagDto } from "@/interfaces/tag.interface";
import {
  CreateQRCodeDto,
  QRCode,
  UpdateQRCodeDto,
} from "@/interfaces/qr-code.interface";

// Api Url
const apiBaseUrl: string =
  process.env.NEXT_PUBLIC_API_ROUTE ?? "http://ERROR/api";

// Client to fetch
const axiosClient = Axios.create({
  baseURL: `${apiBaseUrl}/api/`,
  timeout: 10 * 1000, // 10 sec
  withCredentials: true, // Cookies
});

// # Mutations ----------------------------------------------------------------
// ## Users
export const registerUser = async (
  createUserDto: CreateUserDto
): Promise<SessionDto> => {
  return axiosClient
    .post("auth/register", createUserDto)
    .then((response) => response.data);
};

export const login = async (
  loginUserDto: LoginUserDto
): Promise<SessionDto> => {
  return axiosClient
    .post("auth/login", loginUserDto)
    .then((response) => response.data);
};

export const loginWithToken = async (token: string): Promise<SessionDto> => {
  return axiosClient
    .post(
      "auth/login-with-token",
      { accessToken: token },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => response.data);
};

export const updateUser = async (params: {
  updateUserDto: UpdateUserDto;
}): Promise<User> => {
  const { updateUserDto } = params;
  return axiosClient
    .patch("user", updateUserDto)
    .then((response) => response.data);
};

export const logout = async (): Promise<void> => {
  const token = Cookies.get("accessToken");
  return axiosClient
    .post("auth/logout", null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const sendEmailConfirmationEmail = async (): Promise<void> => {
  const token = Cookies.get("accessToken");
  return axiosClient
    .post("auth/email-confirmation/send", null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const confirmEmail = async (token: string): Promise<void> => {
  return axiosClient
    .post("auth/email-confirmation/confirm", null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export const sendRecoverPasswordEmail = async (
  recoverPasswordDto: RecoverPasswordDto
): Promise<void> => {
  return axiosClient
    .post("auth/recover-password/send", recoverPasswordDto)
    .then((response) => response.data);
};

export const changePassword = async (
  token: string,
  changePasswordDto: ChangePasswordDto
): Promise<void> => {
  return axiosClient
    .post("auth/change-password", changePasswordDto, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

// ## Kingdoms
export const createKingdom = async (params: {
  createKingdomDto: CreateKingdomDto;
}): Promise<Kingdom> => {
  const { createKingdomDto } = params;
  return axiosClient
    .post("kingdom", createKingdomDto)
    .then((response) => response.data);
};

export const updateKingdom = async (params: {
  updateKingdomDto: UpdateKingdomDto;
}): Promise<Kingdom> => {
  const { updateKingdomDto } = params;
  return axiosClient
    .patch("kingdom", updateKingdomDto)
    .then((response) => response.data);
};

export const deleteKingdom = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`kingdom/${id}`).then((response) => response.data);
};

// ## Phylums
export const createPhylum = async (params: {
  createPhylumDto: CreatePhylumDto;
}): Promise<Phylum> => {
  const { createPhylumDto } = params;
  return axiosClient
    .post("phylum", createPhylumDto)
    .then((response) => response.data);
};

export const updatePhylum = async (params: {
  updatePhylumDto: UpdatePhylumDto;
}): Promise<Phylum> => {
  const { updatePhylumDto } = params;
  return axiosClient
    .patch("phylum", updatePhylumDto)
    .then((response) => response.data);
};

export const deletePhylum = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`phylum/${id}`).then((response) => response.data);
};

// ## ClassesTax
export const createClassTax = async (params: {
  createClassTaxDto: CreateClassTaxDto;
}): Promise<ClassTax> => {
  const { createClassTaxDto } = params;
  return axiosClient
    .post("class-tax", createClassTaxDto)
    .then((response) => response.data);
};

export const updateClassTax = async (params: {
  updateClassTaxDto: UpdateClassTaxDto;
}): Promise<ClassTax> => {
  const { updateClassTaxDto } = params;
  return axiosClient
    .patch("class-tax", updateClassTaxDto)
    .then((response) => response.data);
};

export const deleteClassTax = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient
    .delete(`class-tax/${id}`)
    .then((response) => response.data);
};

// ## OrdersTax
export const createOrderTax = async (params: {
  createOrderTaxDto: CreateOrderTaxDto;
}): Promise<OrderTax> => {
  const { createOrderTaxDto } = params;
  return axiosClient
    .post("order-tax", createOrderTaxDto)
    .then((response) => response.data);
};

export const updateOrderTax = async (params: {
  updateOrderTaxDto: UpdateOrderTaxDto;
}): Promise<OrderTax> => {
  const { updateOrderTaxDto } = params;
  return axiosClient
    .patch("order-tax", updateOrderTaxDto)
    .then((response) => response.data);
};

export const deleteOrderTax = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient
    .delete(`order-tax/${id}`)
    .then((response) => response.data);
};

// ## Families
export const createFamily = async (params: {
  createFamilyDto: CreateFamilyDto;
}): Promise<Family> => {
  const { createFamilyDto } = params;
  return axiosClient
    .post("family", createFamilyDto)
    .then((response) => response.data);
};

export const updateFamily = async (params: {
  updateFamilyDto: UpdateFamilyDto;
}): Promise<Family> => {
  const { updateFamilyDto } = params;
  return axiosClient
    .patch("family", updateFamilyDto)
    .then((response) => response.data);
};

export const deleteFamily = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`family/${id}`).then((response) => response.data);
};

// ## Genera
export const createGenus = async (params: {
  createGenusDto: CreateGenusDto;
}): Promise<Genus> => {
  const { createGenusDto } = params;
  return axiosClient
    .post("genus", createGenusDto)
    .then((response) => response.data);
};

export const updateGenus = async (params: {
  updateGenusDto: UpdateGenusDto;
}): Promise<Genus> => {
  const { updateGenusDto } = params;
  return axiosClient
    .patch("genus", updateGenusDto)
    .then((response) => response.data);
};

export const deleteGenus = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`genus/${id}`).then((response) => response.data);
};

// ## Tags
export const createTag = async (params: {
  createTagDto: CreateTagDto;
}): Promise<Tag> => {
  const { createTagDto } = params;
  return axiosClient
    .post("tag", createTagDto)
    .then((response) => response.data);
};

export const updateTag = async (params: {
  updateTagDto: UpdateTagDto;
}): Promise<Tag> => {
  const { updateTagDto } = params;
  return axiosClient
    .patch("tag", updateTagDto)
    .then((response) => response.data);
};

export const deleteTag = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`tag/${id}`).then((response) => response.data);
};

// ## Species
export const createSpecies = async (params: {
  createSpeciesDto: CreateSpeciesDto;
}): Promise<Species> => {
  const { createSpeciesDto } = params;
  return axiosClient
    .post("species", createSpeciesDto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const updateSpecies = async (params: {
  updateSpeciesDto: UpdateSpeciesDto;
}): Promise<Species> => {
  const { updateSpeciesDto } = params;

  return axiosClient
    .patch("species", updateSpeciesDto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const deleteSpecies = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`species/${id}`).then((response) => response.data);
};

// ## Specimens
export const createSpecimen = async (params: {
  createSpecimenDto: CreateSpecimenDto;
}): Promise<Specimen> => {
  const { createSpecimenDto } = params;
  return axiosClient
    .post("specimen", createSpecimenDto)
    .then((response) => response.data);
};

export const updateSpecimen = async (params: {
  updateSpecimenDto: UpdateSpecimenDto;
}): Promise<Specimen> => {
  const { updateSpecimenDto } = params;
  return axiosClient
    .patch("specimen", updateSpecimenDto)
    .then((response) => response.data);
};

export const deleteSpecimen = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`specimen/${id}`).then((response) => response.data);
};

// ## QRCodes
export const createQRCode = async (params: {
  createQRCodeDto: CreateQRCodeDto;
}): Promise<QRCode> => {
  const { createQRCodeDto } = params;
  return axiosClient
    .post("qr-code", createQRCodeDto)
    .then((response) => response.data);
};

export const updateQRCode = async (params: {
  updateQRCodeDto: UpdateQRCodeDto;
}): Promise<QRCode> => {
  const { updateQRCodeDto } = params;
  return axiosClient
    .patch("qr-code", updateQRCodeDto)
    .then((response) => response.data);
};

export const deleteQRCode = async (params: { id: number }): Promise<void> => {
  const { id } = params;
  return axiosClient.delete(`qr-code/${id}`).then((response) => response.data);
};

// # Queries ------------------------------------------------------------------

// ## Users
export const getAuthUser = async (): Promise<User> => {
  const token = Cookies.get("accessToken");
  return axiosClient.get("auth/me").then((response) => response.data);
};

export const getUsers = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<User>> => {
  const { pagination } = params;
  return axiosClient
    .get(`user`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getUser = async (params: { id: number }): Promise<User> => {
  const { id } = params;
  return axiosClient.get(`user/${id}`).then((response) => response.data);
};

// ## Kingdoms
export const getKingdoms = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Kingdom>> => {
  const { pagination } = params;
  return axiosClient
    .get(`kingdom`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getKingdom = async (params: { id: number }): Promise<Kingdom> => {
  const { id } = params;
  return axiosClient.get(`kingdom/${id}`).then((response) => response.data);
};

// ## Phylums
export const getPhylums = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Phylum>> => {
  const { pagination } = params;
  return axiosClient
    .get(`phylum`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getPhylum = async (params: { id: number }): Promise<Phylum> => {
  const { id } = params;
  return axiosClient.get(`phylum/${id}`).then((response) => response.data);
};

// ## ClassesTax
export const getClassesTax = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<ClassTax>> => {
  const { pagination } = params;
  return axiosClient
    .get(`class-tax`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getClassTax = async (params: {
  id: number;
}): Promise<ClassTax> => {
  const { id } = params;
  return axiosClient.get(`class-tax/${id}`).then((response) => response.data);
};

// ## OrdersTax
export const getOrdersTax = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<OrderTax>> => {
  const { pagination } = params;
  return axiosClient
    .get(`order-tax`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getOrderTax = async (params: {
  id: number;
}): Promise<OrderTax> => {
  const { id } = params;
  return axiosClient.get(`order-tax/${id}`).then((response) => response.data);
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

// ## Tags
export const getTags = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<Tag>> => {
  const { pagination } = params;
  return axiosClient
    .get(`tag`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getTag = async (params: { id: number }): Promise<Tag> => {
  const { id } = params;
  return axiosClient.get(`tag/${id}`).then((response) => response.data);
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

export const getSpeciesFullSearch = async (params: {
  pagination?: PaginationSpecies;
}): Promise<PaginatedList<Species>> => {
  const { pagination } = params;
  return axiosClient
    .get(`species/search`, {
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

// ## QRCodes
export const getQRCodes = async (params: {
  pagination?: Pagination;
}): Promise<PaginatedList<QRCode>> => {
  const { pagination } = params;
  return axiosClient
    .get(`qr-code`, {
      params: pagination,
    })
    .then((response) => response.data);
};

export const getQRCode = async (params: { id: number }): Promise<QRCode> => {
  const { id } = params;
  return axiosClient.get(`qr-code/${id}`).then((response) => response.data);
};

// ## Administration
export const getGlobalSearch = async (params: {
  value: string;
}): Promise<any> => {
  const { value } = params;
  return axiosClient
    .get(`administration/global-search`, { params: { value: value } })
    .then((response) => response.data);
};
