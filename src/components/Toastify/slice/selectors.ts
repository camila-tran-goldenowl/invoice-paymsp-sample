import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "types";
import { initialState } from ".";

export const selectToast = (state: RootState) => state.toastify || initialState;

export const selectCurrentToast = createSelector([selectToast], toastify => toastify.current);
export const selectToastList = createSelector([selectToast], toastify => toastify.list);
export const selectUnReadNumber = createSelector(
  [selectToast],
  toastify => toastify?.list?.filter(item => !item.isRead).length || 0
);
