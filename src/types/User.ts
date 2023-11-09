import { ICustomer } from "pages/Customer/slice/types";
import { ITenant } from "components/Tenant/slice/types";
import { defaultPaymentGateway } from "pages/Settings/PaymentGateway/slice/types";

export interface IRole {
  id: string;
  name: string;
  resource_id: string | null;
  resource_type: string | null;
  created_at: string;
}

export interface IUser {
  id: string;
  tenant_id: string;
  resource_type: string;
  resource_id: string;
  customer_id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  full_name: string;
  last_sign_in_at: string;
  status: string;
  customer: ICustomer;
  roles: Array<IRole>;
  tenant: ITenant;
  main_role: IRole;
}

export interface IAddress {
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zip_code: string;
  default: boolean;
  // type: "billing" | "shipping" | "global";
  type: string;
  fax_number: string;
  phone_number: string;
  formatted_country: string;
  formatted_state: string;
  last_name: string;
  first_name?: string;
  company?: string;
  customer_type?: string;
}

export const defaultAddress = {
  address1: "",
  address2: "",
  city: "",
  country: "",
  state: "",
  zip_code: "",
  default: false,
  type: "billing",
  fax_number: "",
  phone_number: "",
  formatted_country: "",
  formatted_state: "",
  last_name: "",
  first_name: "",
  authorize_detail: defaultPaymentGateway,
};
