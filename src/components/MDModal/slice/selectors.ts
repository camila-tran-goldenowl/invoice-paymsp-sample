import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "types";
import { initialState } from ".";

export const selectDomain = (state: RootState) => state?.modal || initialState;

export const selectModal = createSelector([selectDomain], state => state);
