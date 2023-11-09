import { saga } from "./saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { IPayment, IPaymentState } from "./types";
import { defaultPaginationResponse } from "types";
import { createSlice } from "utils/@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { ITenant, defaultTenant } from "components/Tenant/slice/types";
import { IInvoice } from "types/Invoice";

export const initialState: IPaymentState = {
  loading: false,
  error: null,
  data: null,
  list: [],
  tenant: defaultTenant,
  pagination: defaultPaginationResponse,
};

const slice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    getAllRequest(
      state,
      action: PayloadAction<{
        customerId?: string;
        page: Number;
        pageSize: Number;
      }>
    ) {
      state.loading = true;
      state.error = null;
    },
    getAllRequestSuccess(state, action) {
      const { data, pagination } = action.payload;
      state.list = data;
      state.pagination = pagination;
      state.loading = false;
    },
    getAllRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    detailRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    detailRequestWithoutLoginSuccess(
      state,
      action: PayloadAction<{ receipt: IPayment; tenant: ITenant; invoice: IInvoice }>
    ) {
      state.loading = false;
      const { receipt, tenant } = action.payload;
      state.data = receipt;
      state.tenant = tenant;
    },
    detailRequestSuccess(state, action: PayloadAction<IPayment>) {
      state.loading = false;
      state.data = action.payload;
    },
    detailRequestFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    sendPDFRecieptRequest(
      state,
      action: PayloadAction<{
        invoiceList: Array<string | number>;
        actionSuccess?: () => void;
        emailList?: Array<string>;
        subdomain?: string;
      }>
    ) {
      state.loading = true;
    },
    sendPDFRecieptSuccess(state) {
      state.loading = false;
    },
    sendPDFRecieptFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { actions, reducer } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga });
  return { actions: slice.actions };
};
