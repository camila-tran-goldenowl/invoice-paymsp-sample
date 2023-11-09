import { RootState } from "types";
import { initialState } from ".";
import { IPaymentMethodState } from "./types";
import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: RootState): IPaymentMethodState =>
  state.paymentMethodCustomer || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectPaymentMethodList = createSelector([selectDomain], state => state.data);
export const selectPaymentMethodDefault = createSelector([selectDomain], state => state.default);
