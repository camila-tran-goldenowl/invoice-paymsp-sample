import { defaultTenant } from "components/Tenant/slice/types";
import { saga } from "./saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { ITenantState } from "./types";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { actions as signInActions } from "pages/SignInPage/slice";
// import { actions as paymentGatewayActions } from "pages/Settings/PaymentGateway/slice";
import { actions as autotaskActions } from "pages/Integration/components/Autotask/slice";
import { actions as connectwiseActions } from "pages/Integration/components/Connectwise/slice";

import { SignInResponse } from "pages/SignInPage/slice/types";

export const initialState: ITenantState = {
  tenant: null,
  isUpdated: null,
  loading: false,
  error: null,
  setup: {},
};

const slice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    detailsFetchRequest(state) {
      state.loading = true;
    },
    detailsFetchSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.tenant = action.payload.data;
    },
    detailsFetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    detailsUpdateRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    detailsUpdateSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.tenant = action.payload.data;
      state.isUpdated = true;
    },
    detailsUpdateFail(state, action) {
      state.loading = false;
      state.isUpdated = null;
      state.error = action.payload;
    },
    withoutLoggedFetchRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    withoutLoggedFetchSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      const { data } = action.payload;
      if (!data) {
        state.tenant = null;
      } else state.tenant = action.payload.data;
    },
    withoutLoggedFetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.tenant = null;
    },
    updateEnforceFactorRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    updateEnforceFactorSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.tenant = action.payload.data;
    },
    updateEnforceFactorFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateThemeRequest(state, action) {
      state.loading = true;
    },
    updateThemeSuccess(state, action) {
      state.loading = false;
      const { theme_setting } = action.payload;
      state.tenant.theme_setting = theme_setting;
    },
    updateThemeFail(state, action) {
      state.loading = false;
    },
    getListSettingRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getListSettingSuccess(state, action) {
      state.loading = false;
      state.setup = action.payload.data;
    },
    getListSettingFail(state, action) {
      state.loading = false;
    },
    updateSettingRequest(state, action: PayloadAction<{ actionSuccess?: () => void; data: any }>) {
      state.loading = true;
      state.error = null;
    },
    updateSettingSuccess(state) {
      state.loading = false;
    },
    updateSettingFail(state, action) {
      state.loading = false;
    },
    syncAllForCustomerRequest(state) {
      state.loading = true;
    },
    syncAllForCustomerSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },
    syncAllForCustomerFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: {
    [signInActions.signInSuccess.type]: (state, action: PayloadAction<SignInResponse>) => {
      state.tenant = action.payload.data.tenant;
    },
    [signInActions.detailsFetchSuccess.type]: (state, action: PayloadAction<SignInResponse>) => {
      state.tenant = action.payload.data.tenant;
    },
    [signInActions.signOutSuccess.type]: state => {
      const tenantName = state.tenant?.name ?? "";
      const logo = state.tenant?.logo_url ?? "";

      state.tenant = {
        ...defaultTenant,
        name: tenantName,
        logo_url: logo,
      };
    },
    [connectwiseActions.detailsUpdateSuccess.type]: (state, action) => {
      state.tenant.integrations.connectwise = true;
    },
    [connectwiseActions.detailsCreateSuccess.type]: (state, action) => {
      state.tenant.integrations.connectwise = true;
    },
    [autotaskActions.detailsUpdateSuccess.type]: (state, action) => {
      state.tenant.integrations.autotask = true;
    },
    [autotaskActions.detailsCreateSuccess.type]: (state, action) => {
      state.tenant.integrations.autotask = true;
    },
  },
});

export const { actions, reducer } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga });
  return { actions: slice.actions };
};
