import { RootState } from "types";
import { initialState } from ".";
import { IPaymentMethodState } from "./types";
import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: RootState): IPaymentMethodState =>
  state.paymentMethodTenant || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectPaymentMethodDetail = createSelector([selectDomain], state => state.default);
export const selectClientSecret = createSelector([selectDomain], state => state.client_secret);
