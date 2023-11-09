import { IUser } from "types";

export interface SignInState {
  isLoggetIn: boolean;
  loading: boolean;
  error?: string | null;
  user?: any;
  status: string;
  subdomain: string;
  role: string;
  csrfToken: null | string;
  pathnameDirect: null | string;
  noLoginFail: Number;
}

export interface SignInForm {
  email: string;
  password: string;
  otp?: string;
  subdomain?: string;
  capcha?: string;
}

export interface SignInResponse {
  success: boolean;
  data: IUser;
  token: string;
}

export interface IBasicInfoUpdateForm {
  old_password: string;
  password: string;
  email: string;
  last_name: string;
  first_name: string;
}
