import store from "store";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { actions } from ".";
import { IApiArguments } from "types";
import { request, hanleErrorMessage } from "utils/request";
import { toastActions, IToastType } from "components/Toastify/slice";
import { setKeyValue } from "utils/localStorageUtil";
import { StorageKey } from "utils/constants";
import { hostname, isAdminPage } from "utils/helperFunc";
import { loadingActions } from "components/MDLoading/slice";

export function* withoutLoggedFetchRequest(action: PayloadAction<any>) {
  yield put(loadingActions.show());
  const url = "/tenant/without_logged";

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
      params: { hostname: action.payload.hostname },
    },
    url,
    isAuthRequired: false,
    isSubdomain: false,
  };

  try {
    const data = yield call(request, apiArgs);
    const { name = "" } = data.data;
    setKeyValue(StorageKey.authSubdomain, name);
    yield put(actions.withoutLoggedFetchSuccess(data));
    yield put(loadingActions.close());
  } catch (err: any) {
    isAdminPage && setKeyValue(StorageKey.authSubdomain, hostname);
    yield put(actions.withoutLoggedFetchFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* detailsFetchRequest() {
  yield put(loadingActions.show());
  const url = `/tenant`;

  const apiArgs: IApiArguments = {
    params: { method: "GET" },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.detailsFetchSuccess(data));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.detailsFetchFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* detailsUpdateRequest(action: PayloadAction<any>) {
  yield put(loadingActions.show());
  const url = `/tenant`;

  const { formData, actionMessage = "Company Profile" } = action.payload;

  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(actions.detailsUpdateSuccess(data));
      yield put(toastActions.notify({ type: IToastType.SUCCESS, title: `${actionMessage} saved` }));
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `${actionMessage} failed`,
          content: hanleErrorMessage(data.errors),
        })
      );
    }

    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `${actionMessage} failed`,
        content: hanleErrorMessage(err),
      })
    );
    yield put(actions.detailsUpdateFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* updateFactorRequest(action: PayloadAction<{ enforce_multifactor: boolean }>) {
  yield put(loadingActions.show());
  const url = `/tenant`;

  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: action.payload,
    },
    url,
  };

  try {
    yield call(request, apiArgs);
    yield put(toastActions.notify({ type: IToastType.SUCCESS, title: "MFA policy saved" }));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(toastActions.notify({ type: IToastType.ERROR, title: "MFA policy save failed" }));
    yield put(actions.detailsUpdateFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* updateThemeRequest(
  action: PayloadAction<{
    miniSidenav?: boolean;
    transparentSidenav?: boolean;
    whiteSidenav?: boolean;
    sidenavColor:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "light"
      | "dark";
    transparentNavbar?: boolean;
    fixedNavbar?: boolean;
    openConfigurator?: boolean;
    direction?: "ltr" | "rtl";
    layout?: "dashboard" | "page";
    darkMode?: boolean;
    accountNavigation?: boolean;
  }>
) {
  yield put(loadingActions.show());
  const storeState = store.getState();
  const theme = storeState.tenant?.tenant?.theme_setting;
  if (!theme) return;
  const url = "/tenant";
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: {
        theme_setting: {
          ...theme,
          ...action.payload,
        },
      },
    },
    url,
  };
  try {
    const data = yield call(request, apiArgs);
    yield put(actions.updateThemeSuccess(data.data));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.updateThemeFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* updateSettingRequest(
  action: PayloadAction<{ actionSuccess?: () => void; data: any }>
) {
  yield put(loadingActions.show());
  const { actionSuccess, data } = action.payload;

  const url = `/tenant/settings/set`;

  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data,
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(actions.updateSettingSuccess());
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Save successfully`,
        })
      );
      yield put(actions.getListSettingRequest());
      actionSuccess?.();
    } else {
      yield put(actions.updateSettingFail(null));
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Save fail`,
          content: data.errors,
        })
      );
    }
    yield put(loadingActions.close());
  } catch (err: any) {
    const errors = err.errors;
    yield put(actions.updateSettingFail(err.errors));
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `Save fail`,
        content: errors,
      })
    );
    yield put(loadingActions.close());
  }
}

export function* getListSettingRequest() {
  yield put(loadingActions.show());

  const url = "/tenant/settings/get";

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.getListSettingSuccess(data));

    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.getListSettingFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* syncAllForCustomerRequest() {
  yield put(loadingActions.show());
  const url = `/tenant/sync_for_all_customers`;

  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Sync for all customers successfully`,
        })
      );
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Sync for all customers failed`,
          content: hanleErrorMessage(data.errors),
        })
      );
    }

    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `Sync for all customers failed`,
        content: hanleErrorMessage(err),
      })
    );
    yield put(actions.detailsUpdateFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* saga() {
  yield takeLatest(actions.withoutLoggedFetchRequest.type, withoutLoggedFetchRequest);
  yield takeLatest(actions.detailsFetchRequest.type, detailsFetchRequest);
  yield takeLatest(actions.detailsUpdateRequest.type, detailsUpdateRequest);
  yield takeLatest(actions.updateEnforceFactorRequest.type, updateFactorRequest);
  yield takeLatest(actions.updateThemeRequest.type, updateThemeRequest);
  yield takeLatest(actions.getListSettingRequest.type, getListSettingRequest);
  yield takeLatest(actions.updateSettingRequest.type, updateSettingRequest);
  yield takeLatest(actions.syncAllForCustomerRequest.type, syncAllForCustomerRequest);
}
