import { defaultAddress, IAddress } from "./User";

export interface IPaymentCard {
  name: string;
  number: string;
  cvv: string;
  expiration: string;
  default: boolean;
  customer_id: string;
}

export const defaultPaymentCard = {
  name: "",
  number: "",
  cvv: "",
  expiration: "",
  default: false,
  customer_id: "",
};

export interface IPaymentResponse {
  id: string;
  card_type: string;
  name: string;
  default: boolean;
  expiration: string | null;
  last_4digits: string;
  type: "card" | "bank";
  address: IAddress;
  subscription?: boolean;
  card_expiration: string;
  hosted_verification_url: string | null;
}

export const defaultPaymentResponse = {
  id: "",
  card_type: "",
  name: "",
  default: false,
  expiration: "",
  card_expiration: "",
  last_4digits: "",
  type: "card" as const,
  address: defaultAddress,
  hosted_verification_url: null,
};
