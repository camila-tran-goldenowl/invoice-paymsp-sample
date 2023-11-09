import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { SignInForm, IBasicInfoUpdateForm } from "./types";
import { actions } from ".";
import { IApiArguments } from "types";
import { request } from "utils/request";
import { toastActions, IToastType } from "components/Toastify/slice";
import { actions as actionsFactor } from "pages/TwoFactors/slice";
import { loadingActions } from "components/MDLoading/slice";

export function* signInRequest(action: PayloadAction<SignInForm>) {
  yield put(loadingActions.show());
  const url = "/users/sign_in";
  const subdomainHeaders = action.payload.subdomain ? { subdomain: action.payload.subdomain } : {};
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data: { user: action.payload },
      headers: { ...subdomainHeaders },
    },
    url,
    isAuthRequired: false,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.hasOwnProperty("errors")) {
      yield put(actions.signInFail(data.errors));
    } else {
      yield put(actions.signInSuccess(data));
    }
  } catch (err: any) {
    yield put(actions.signInFail(err.errors));
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Login failed",
        content: err.errors,
      })
    );
  }
  yield put(loadingActions.close());
}

export function* detailsFetchRequest(action: PayloadAction<SignInForm>) {
  yield put(loadingActions.show());
  const url = "/profiles";
  const apiArgs: IApiArguments = {
    params: { method: "GET" },
    url,
  };
  try {
    const data = yield call(request, apiArgs);
    yield put(actions.detailsFetchSuccess(data));
    yield put(loadingActions.close());
  } catch (err: any) {
    // yield put(actions.detailsFetchFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* signOutRequest(action: PayloadAction<SignInForm>) {
  yield put(loadingActions.show());
  const url = "/users/sign_out";

  const apiArgs: IApiArguments = {
    params: { method: "DELETE" },
    url,
  };

  try {
    yield call(request, apiArgs);
    yield put(actions.signOutRequest());
    yield put(actionsFactor.reset());
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.signOutFail(err?.errors));
    yield put(loadingActions.close());
  }
}

export function* updateProfileRequest(
  action: PayloadAction<{ data: IBasicInfoUpdateForm; actionSuccess?: () => void }>
) {
  yield put(loadingActions.show());
  const { data, actionSuccess } = action.payload;
  const url = "/profiles";
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data,
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      actionSuccess?.();
      yield put(toastActions.notify({ type: IToastType.SUCCESS, title: "Profile updated" }));
      yield put(actions.updateProfileSuccess(data));
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Profile update failed",
          content: data.message,
        })
      );
      yield put(actions.updateProfileFail(data.message));
    }
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Profile update failed",
        content: err.errors,
      })
    );
    yield put(actions.updateProfileFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* verifyCapchaRequest(
  action: PayloadAction<{ token: string; successAction: () => void; failAction?: () => void }>
) {
  yield put(loadingActions.show());
  const { token, successAction, failAction } = action.payload;
  const url = "/options/recaptcha_verify";
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data: { response: token },
    },
    url,
    isAuthRequired: false,
    isSubdomain: false,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      successAction?.();
      yield put(actions.verifyCapchaSuccess());
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Verify Recapcha failed",
        })
      );
      failAction?.();
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Verify Recapcha failed",
      })
    );
    yield put(actions.verifyCapchaFail(err.errors));
    failAction?.();
  }
  yield put(loadingActions.close());
}

export function* saga() {
  yield takeLatest(actions.signInRequest.type, signInRequest);
  yield takeLatest(actions.signOutRequest.type, signOutRequest);
  yield takeLatest(actions.detailsFetchRequest.type, detailsFetchRequest);
  yield takeLatest(actions.updateProfileRequest.type, updateProfileRequest);
  yield takeLatest(actions.verifyCapchaRequest.type, verifyCapchaRequest);
}
