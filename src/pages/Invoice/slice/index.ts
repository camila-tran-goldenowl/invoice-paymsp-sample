import { saga } from "./saga";
// type
import { IInvoiceState } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { defaultInvoiceDetail } from "types/Invoice";

export const initialState: IInvoiceState = {
  error: null,
  loading: false,
  data: defaultInvoiceDetail,
};

const slice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    getDetailRequest(state, action) {
      state.loading = true;
    },
    getDetailSuccess(state, action) {
      const { data } = action.payload;
      state.loading = false;
      state.data = data;
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
    chargeWithoutLoginRequest(state, action) {
      state.loading = true;
    },
    chargeWithoutLoginSuccess(state, action) {
      state.loading = false;
    },
    chargeWithoutLoginFail(state, action) {
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
  },
});

export const { actions, reducer } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga });
  return { actions: slice.actions };
};
