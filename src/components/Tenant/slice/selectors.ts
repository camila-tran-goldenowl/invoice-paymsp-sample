import { createSelector } from "@reduxjs/toolkit";
import { defaultThemeSetting } from "./types";
import { RootState } from "types";
import { initialState } from ".";
import { ITenantState } from "./types";
import { defaultIntegrations } from "./types";

const selectDomain = (state: RootState): ITenantState => state.tenant || initialState;

export const selectError = createSelector([selectDomain], state => state.error);
export const selectLoading = createSelector([selectDomain], state => state.loading);
export const selectTenant = createSelector([selectDomain], state => state.tenant);
export const selectIsUpdated = createSelector([selectDomain], state => state.isUpdated);

export const selectDisableCredit = createSelector([selectDomain], state =>
  state.tenant?.payment_gateway_name
    ? state.tenant?.[`${state.tenant.payment_gateway_name}_detail`]?.disable_credit_card
    : false
);

export const selectFeePercent = createSelector([selectDomain], state =>
  state.tenant?.payment_gateway_name
    ? state.tenant?.[`${state.tenant.payment_gateway_name}_detail`]?.convenience_fee_percent
    : 0
);

export const selectACHDiscount = createSelector([selectDomain], state =>
  state.tenant?.payment_gateway_name
    ? state.tenant?.[`${state.tenant.payment_gateway_name}_detail`]?.bank_discount_percent
    : 0
);

export const selectIntegrations = createSelector(
  [selectDomain],
  state => state.tenant?.integrations || defaultIntegrations
);

export const selectCompanyName = createSelector([selectDomain], state => state.tenant?.name);

export const selectThemeSetting = createSelector(
  [selectDomain],
  state => state.tenant?.theme_setting ?? defaultThemeSetting
);

export const selectPlan = createSelector([selectDomain], state => state?.tenant?.plan ?? null);

export const selectIsEnforceFA = createSelector(
  [selectDomain],
  state => state?.tenant?.enforce_multifactor ?? false
);

export const selectQuickbookDesktopPassword = createSelector(
  [selectDomain],
  state => state?.tenant?.quickbook_desktop_password ?? ""
);

export const selectResourcePriority = createSelector(
  [selectDomain],
  state => state?.tenant?.resources_priority ?? []
);

export const selectSetup = createSelector([selectDomain], state => state.setup);

export const selectGatewayType = createSelector(
  [selectDomain],
  state => state?.tenant?.payment_gateway_name
);

export const selectWepayIDDetail = createSelector(
  [selectDomain],
  state => state?.tenant?.wepay_detail ?? null
);
