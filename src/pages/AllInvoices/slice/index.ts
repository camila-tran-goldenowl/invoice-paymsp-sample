import { defaultPaginationResponse } from "types";
import { saga } from "./saga";
// type
import { IInvoicesState } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { PayloadAction } from "@reduxjs/toolkit";

export const initialState: IInvoicesState = {
  error: null,
  loading: false,
  data: [],
  pagination: defaultPaginationResponse,
};

const slice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    getDetailRequest(
      state,
      action: PayloadAction<{
        customerId?: string;
        filter?: string;
        searchText?: string;
        page: Number;
        pageSize: Number;
        orderBy?: string;
        sortDirection?: "asc" | "desc";
      }>
    ) {
      state.loading = true;
    },
    getDetailSuccess(state, action) {
      const { data, pagination } = action.payload;
      state.data = data;
      state.pagination = pagination;
      state.loading = false;
    },
    getDetailFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    chargeRequest(state, action) {
      state.loading = true;
    },
    chargeSuccess(state) {
      state.loading = false;
    },
    chargeFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    refundRequest(state, action) {
      state.loading = true;
    },
    refundSuccess(state) {
      state.loading = false;
    },
    refundFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    exportCSVInvoiceRequest(state, action) {
      state.loading = true;
    },
    exportCSVInvoiceSuccess(state) {
      state.loading = false;
    },
    exportCSVInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteInvoiceRequest(state, action) {
      state.loading = true;
    },
    deleteInvoiceSuccess(state) {
      state.loading = false;
    },
    deleteInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    sendPDFInvoiceRequest(
      state,
      action: PayloadAction<{
        invoiceList: Array<string | number>;
        emailList?: Array<string>;
        actionSuccess?: () => void;
      }>
    ) {
      state.loading = true;
    },
    sendPDFInvoiceSuccess(state) {
      state.loading = false;
    },
    sendPDFInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    sendPaynowInvoiceRequest(
      state,
      action: PayloadAction<{
        invoiceList: Array<string | number>;
        emailList?: Array<string>;
        actionSuccess?: () => void;
      }>
    ) {
      state.loading = true;
    },
    sendPaynowInvoiceSuccess(state) {
      state.loading = false;
    },
    sendPaynowInvoiceFail(state, action) {
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
