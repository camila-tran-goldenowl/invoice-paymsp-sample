import { IPaginationResponse } from "types";
import { defaultInvoiceDetail, IInvoice } from "types/Invoice";
import { defaultCustomer, ICustomer } from "pages/Customer/slice/types";
import { ITenant } from "components/Tenant/slice/types";

export interface IPaymentState {
  loading: boolean;
  error?: string | null;
  data: null | IPayment;
  list: Array<IPayment>;
  tenant: ITenant;
  pagination: IPaginationResponse;
}

export interface IItemPayment {
  convenience_fee_value: Number;
  formatted_total_price: string;
  formatted_unit_price: string;
  name: string;
  quantity: number;
  total_price_value: Number;
  unit_price_value: Number;
}

export interface IPayment {
  amount_value: number;
  charge_type: string;
  created_at: string;
  customer: ICustomer;
  formatted_amount: string;
  id: string;
  invoice: IInvoice;
  line_items: Array<IItemPayment>;
  status: string;
  authorizenet_authorization_code: string;
  authorizenet_transaction_id: string;
}

export const defaultPayment = {
  amount_value: 0,
  charge_type: "",
  created_at: "",
  customer: defaultCustomer,
  formatted_amount: "",
  id: "",
  invoice: defaultInvoiceDetail,
  status: "open",
  line_items: [],
  authorizenet_authorization_code: "",
  authorizenet_transaction_id: "",
};
