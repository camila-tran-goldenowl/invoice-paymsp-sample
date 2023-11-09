import { AxiosRequestConfig } from "axios";

export interface IApiResponse {
  data?: any;
  pagination?: IPaginationResponse;
  success?: boolean | null;
  errors?: string | null;
  message?: string | null;
  invitations?: string | null;
}

export interface IApiArguments extends AxiosRequestConfig {
  url: string;
  isAuthRequired?: boolean;
  isSubdomain?: boolean;
}

export interface IPaginationResponse {
  current: number;
  next: number | null;
  prev: number | null;
  total_pages: number;
  total_count: number;
  page_size: number;
  out_of_range: boolean;
}

export const defaultPaginationResponse: IPaginationResponse = {
  current: 1,
  next: null,
  prev: null,
  total_pages: 1,
  total_count: 0,
  page_size: 1,
  out_of_range: false,
};

export enum ErrorType {
  RESPONSE_ERROR = "Response Error",
}

export interface IPaginationRequest {
  per: number;
  page: number;
}

export const perOptions = [5, 10, 25];

export const defaultPaginationRequest: IPaginationRequest = {
  per: perOptions[1],
  page: 1,
};
