import { saga } from "./saga";
// type
import { IPaymentMethodState } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

import { defaultPaymentResponse } from "types/PaymentCard";

export const initialState: IPaymentMethodState = {
  error: null,
  loading: false,
  client_secret: "",
  default: defaultPaymentResponse,
};

const slice = createSlice({
  name: "paymentMethodTenant",
  initialState,
  reducers: {
    detailFetchRequest(state) {
      state.loading = true;
    },
    detailFetchSuccess(state, action: PayloadAction<any>) {
      const { data } = action.payload;
      state.default = data;
      state.loading = false;
    },
    detailsFetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.default = null;
    },
    updateCardRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    updateCardSuccess(state) {
      state.loading = false;
    },
    updateCardFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCardRequest(state) {
      state.loading = true;
    },
    deleteCardSuccess(state) {
      state.loading = false;
    },
    deleteCardFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    detailSetupIntentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    detailSetupIntentSuccess(state, action) {
      state.loading = false;
      state.client_secret = action.payload.client_secret;
    },
    detailSetupIntentFail(state, action) {
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
