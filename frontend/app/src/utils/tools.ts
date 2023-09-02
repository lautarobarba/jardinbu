import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

// Combine tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return moment(date).format("D/MM/Y (HH:mm)") + "hs";
};

export const formatTitleCase = (text: string) => {
  if (text) return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return "";
};

export const getUrlForImageById = (id: number) => {
  // Api Url
  const apiBaseUrl: string =
    process.env.NEXT_PUBLIC_API_ROUTE ?? "http://ERROR/api";
  return `${apiBaseUrl}/api/image/by-id/${id}`;
};

export const getUrlForImageByUUID = (uuid: string) => {
  // Api Url
  const apiBaseUrl: string =
    process.env.NEXT_PUBLIC_API_ROUTE ?? "http://ERROR/api";
  return `${apiBaseUrl}/api/image/by-uuid/${uuid}`;
};
