import { RootState } from "types";
import { initialState } from ".";
import { IInvoiceState } from "./types";
import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: RootState): IInvoiceState => state.invoice || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectInvoice = createSelector([selectDomain], state => state.data);
