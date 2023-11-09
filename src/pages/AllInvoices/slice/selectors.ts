import { RootState } from "types";
import { initialState } from ".";
import { IInvoicesState } from "./types";
import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: RootState): IInvoicesState => state.invoices || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectInvoicesList = createSelector([selectDomain], state => state.data);
export const selectInvoicesPagination = createSelector([selectDomain], state => state.pagination);
