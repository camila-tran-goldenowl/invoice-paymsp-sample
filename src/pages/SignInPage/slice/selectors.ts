import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "types";
import { initialState } from ".";
import { SignInState } from "./types";

import { isAdminGroup } from "utils/roles";

const selectDomain = (state: RootState): SignInState => state.signIn || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);

export const selectIsAdmin = createSelector([selectDomain], state => {
  return isAdminGroup(state.role);
});
export const selectIsLoggetIn = createSelector([selectDomain], state => state.isLoggetIn);

export const selectUser = createSelector([selectDomain], state => state.user);
export const selectHas2FA = createSelector([selectDomain], state => state?.user?.has_2fa || false);
export const selectSet2FA = createSelector([selectDomain], state => state.user?.has_to_set_2fa);
export const selectRole = createSelector([selectDomain], state => state?.user?.main_role?.name);
export const selectNoLoginFail = createSelector([selectDomain], state => state?.noLoginFail ?? 0);
export const selectPathnameDirect = createSelector([selectDomain], state => state.pathnameDirect);
