import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "types";
import { initialState } from ".";
import { defaultPayment, IPaymentState } from "./types";
import { defaultTenant } from "components/Tenant/slice/types";

const selectDomain = (state: RootState): IPaymentState => state.payment || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectDetail = createSelector([selectDomain], state => state.data ?? defaultPayment);
export const selectTenant = createSelector([selectDomain], state => state.tenant ?? defaultTenant);

export const selectPaymentList = createSelector([selectDomain], state => state.list);
export const selectPaymentPagination = createSelector([selectDomain], state => state.pagination);
