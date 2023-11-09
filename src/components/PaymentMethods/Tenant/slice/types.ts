import { IPaymentResponse } from "types/PaymentCard";

export interface IPaymentMethodState {
  loading: boolean;
  error?: string | null;
  client_secret: null | string;
  default: IPaymentResponse | null;
}
