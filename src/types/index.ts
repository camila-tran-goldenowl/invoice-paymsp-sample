import { RootState } from "./RootState";
import { IUser } from "./User";
import {
  IPaginationResponse,
  IPaginationRequest,
  defaultPaginationResponse,
  defaultPaginationRequest,
  IApiResponse,
  IApiArguments,
  ErrorType,
  perOptions,
} from "./InterfaceApi";

export { perOptions, defaultPaginationResponse, defaultPaginationRequest };
interface IOption {
  value: string;
  label: string;
}

export type {
  RootState,
  IUser,
  IOption,
  IPaginationRequest,
  IPaginationResponse,
  IApiResponse,
  IApiArguments,
  ErrorType,
};
