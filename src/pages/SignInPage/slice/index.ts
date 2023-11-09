import { saga } from "./saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { setAuth, removeAuthToken, setKeyValue } from "utils/localStorageUtil";
import { SignInState, SignInForm, SignInResponse, IBasicInfoUpdateForm } from "./types";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { getAuthToken, getRole, getSubdomain } from "utils/localStorageUtil";
import { ROLES, StorageKey } from "utils/constants";
import { actions as twoFactorActions } from "pages/TwoFactors/slice";

export interface SignInPayload {
  email: string;
  password: string;
}

export const initialState: SignInState = {
  isLoggetIn: Boolean(getAuthToken()) && Boolean(getSubdomain()),
  loading: false,
  error: null,
  status: "",
  subdomain: "",
  role: getRole(),
  noLoginFail: 0,
  csrfToken: null,
  pathnameDirect: null,
};

const slice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    signInRequest(state, action: PayloadAction<SignInForm>) {
      state.loading = true;
      state.error = null;
    },
    signInSuccess(state, action: PayloadAction<SignInResponse>) {
      let { tenant, main_role, customer } = action.payload.data;
      const { id: tenantId } = tenant;
      // TEMP
      const role = main_role.name;
      setAuth({
        token: action.payload.token,
        subdomain: tenant.name,
        tenant_id: tenantId,
        role,
      });
      role === ROLES.client && customer?.id && setKeyValue(StorageKey.customerId, customer.id);
      state.role = role;
      state.isLoggetIn = true;
      state.loading = false;
      state.user = action.payload.data;
      state.noLoginFail = 0;
    },
    signInFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.noLoginFail = Number(state.noLoginFail) + 1;
    },
    signOutRequest(state) {
      state.loading = true;
    },
    signOutSuccess(state) {
      console.log("signout");
      removeAuthToken();
      return { ...initialState, noLoginFail: state.noLoginFail, isLoggetIn: false };
    },
    signOutFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    detailsFetchRequest(state) {
      state.loading = true;
    },
    detailsFetchSuccess(state, action: PayloadAction<any>) {
      const { customer, main_role } = action.payload.data;
      main_role.name === ROLES.client &&
        customer?.id &&
        setKeyValue(StorageKey.customerId, customer.id);
      state.user = action.payload.data;
      state.loading = false;
    },
    detailsFetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    detailTenent(state, action: PayloadAction<any>) {
      state.user.tenant = action.payload.data;
    },
    setHasFAState(state, action: PayloadAction<boolean>) {
      state.user.has_2fa = action.payload;
    },
    setHasToSetFA(state, action: PayloadAction<boolean>) {
      state.user.has_to_set_2fa = action.payload;
    },
    reset(state) {
      state = initialState;
    },
    updateProfileRequest(
      state,
      action: PayloadAction<{ data: IBasicInfoUpdateForm; actionSuccess?: () => void }>
    ) {
      state.loading = true;
    },
    updateProfileSuccess(state, action: PayloadAction<any>) {
      state.user = action.payload.data;
      state.loading = false;
    },
    updateProfileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCSRFToken(state, action) {
      state.csrfToken = action.payload;
    },
    setURLDirect(state, action) {
      state.pathnameDirect = action.payload;
    },
    verifyCapchaRequest(
      state,
      action: PayloadAction<{ token: string; successAction?: () => void; failAction?: () => void }>
    ) {
      state.loading = true;
    },
    verifyCapchaSuccess(state) {
      state.loading = true;
    },
    verifyCapchaFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: {
    [twoFactorActions.verifyFactorSuccess.type]: (state, action) => {
      state.user.has_to_set_2fa = false;
    },
  },
});

export const { actions, reducer } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga });
  return { actions: slice.actions };
};
