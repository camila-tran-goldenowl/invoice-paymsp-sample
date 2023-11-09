import { IPaymentResponse } from "types/PaymentCard";

export interface IPaymentMethodState {
  loading: boolean;
  error?: string | null;
  data: Array<IPaymentResponse>;
  default: IPaymentResponse | null;
}
