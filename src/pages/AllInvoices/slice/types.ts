import { IPaginationResponse } from "types";
import { IInvoiceDetail } from "types/Invoice";

export interface IInvoicesState {
  loading: boolean;
  error?: string | null;
  data: Array<IInvoiceDetail>;
  pagination: IPaginationResponse;
}
