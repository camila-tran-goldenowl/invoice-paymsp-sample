import { IInvoiceDetail } from "types/Invoice";

export interface IInvoiceState {
  loading: boolean;
  error?: string | null;
  data: IInvoiceDetail;
}
