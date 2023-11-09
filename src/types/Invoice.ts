import { ICustomer, defaultCustomer } from "pages/Customer/slice/types";
import { IItemPayment } from "pages/Payments/slice/types";

export interface IInvoice {
  balance: any;
  due_date: string;
  id: string;
  invoice_number: string;
  resource_id: string;
  resource_type: string;
  status: "open" | "paid";
  total_amount: string;
  total_tax: any;
  formatted_total_tax: string;
  formatted_total_amount: string;
}

export interface IItemInvoice {
  amount: string | number;
  description: string | null;
  id: string;
  name: string;
  unit_price: number;
  total_price: number;
  quantity: number;
  resource_id: string;
  resource_type: string;
  tax_amount: null | string | number;
  unit_amount: string | number;
  formatted_total_price: string;
  formatted_unit_price: string;
}

export interface IInvoiceDetail {
  balance: null | string | number;
  customer?: ICustomer;
  due_date: string;
  id: string;
  invoice_number: string;
  line_items: IItemInvoice[];
  resource_id: string;
  resource_type: string;
  status: null | string;
  total_amount: string;
  total_tax: string;
  formatted_total_amount: string;
  formatted_total_tax: string;
  formatted_balance: string;
  formatted_credits: string;
  formatted_payments: string;
  formatted_convenience_fee_price?: string;
  receipt: IReciept;
  formatted_asume_price: {
    formatted_bank_discount_price: string;
    formatted_convenience_fee_price: string;
  };
  formatted_bank_discount_price: string;
  balance_value: number;
  bank_discount_price_value: number;
  convenience_fee_price_value: number;
}

interface IReciept {
  amount_value: number;
  charge_type: string;
  created_at: string;
  formatted_amount: string;
  id: string;
  status: "paid" | "open" | null;
  line_items: Array<IItemPayment>;
}

export const defaultReciept: IReciept = {
  amount_value: 0,
  charge_type: "",
  created_at: "",
  formatted_amount: "",
  id: "",
  status: null,
  line_items: [],
};

// const defaultCustomerInvoice = {
//   email: "",
//   full_address: "",
//   id: "",
//   invoices_balance_sum: "0.0",
//   invoices_count: 0,
//   name: "",
//   resource_id: "",
//   resource_type: "",
//   logo_url: "",
//   active_notifications: null,
// };

export const defaultInvoiceDetail = {
  balance: "0",
  customer: defaultCustomer,
  due_date: "",
  id: "",
  invoice_number: "",
  line_items: [],
  resource_id: "",
  resource_type: "",
  status: "",
  total_amount: "",
  total_tax: "",
  formatted_balance: "",
  formatted_total_amount: "",
  formatted_total_tax: "",
  formatted_credits: "",
  formatted_payments: "",
  receipt: defaultReciept,
  formatted_asume_price: {
    formatted_bank_discount_price: "",
    formatted_convenience_fee_price: "",
  },
  formatted_bank_discount_price: "",
  balance_value: 0,
  bank_discount_price_value: 0,
  convenience_fee_price_value: 0,
};
