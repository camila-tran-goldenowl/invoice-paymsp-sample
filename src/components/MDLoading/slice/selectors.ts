import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "types";
import { initialState } from ".";

export const selectLoading = (state: RootState) => state?.loading || initialState;

export const selectIsShow = createSelector([selectLoading], loading => loading.isShow);
