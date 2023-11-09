import { actions } from ".";
import { IApiArguments } from "types";
import { request } from "utils/request";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import { toastActions, IToastType } from "components/Toastify/slice";
import { loadingActions } from "components/MDLoading/slice";

export function* detailsFetchRequest() {
  yield put(loadingActions.show());
  const url = `/tenant/payments`;

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.detailFetchSuccess(data));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.detailsFetchFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* deleteCardRequest() {
  yield put(loadingActions.show());
  const url = `/tenant/payments`;

  const apiArgs: IApiArguments = {
    params: {
      method: "DELETE",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Payment Method deleted`,
        })
      );
      yield put(actions.deleteCardSuccess());
      yield put(actions.detailFetchRequest());
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Delete payment method fail`,
          content: data.errors,
        })
      );
      yield put(actions.deleteCardFail(data.errors));
    }
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `Delete payment method fail`,
        content: err.errors,
      })
    );
    yield put(actions.deleteCardFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* updateCardRequest(
  action: PayloadAction<{
    isEdit: boolean;
    data?: any;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const {
    data: { wepay_credit_card_id, ...form },
    actionSuccess,
    isEdit,
  } = action.payload;

  const url = `/tenant/payments`;
  const wepay = wepay_credit_card_id ? { wepay_credit_card_id } : {};

  const apiArgs: IApiArguments = {
    params: {
      method: isEdit ? "PUT" : "POST",
      data: {
        default: true,
        ...form,
        ...wepay,
      },
    },
    url,
  };

  const actionText = isEdit ? "edited" : "added";
  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Payment method ${actionText} successfully`,
        })
      );
      yield put(actions.detailFetchRequest());
      yield put(actions.updateCardSuccess());
      actionSuccess?.();
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Payment method ${actionText} fail`,
          content: data.errors,
        })
      );
      yield put(actions.updateCardFail(data.errors));
    }
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `Payment method ${actionText} fail`,
        content: err.errors,
      })
    );
    yield put(actions.updateCardFail(err.errors));
    yield put(loadingActions.close());
  }
}
export function* detailSetupIntentRequest() {
  yield put(loadingActions.show());

  const url = `/tenant/payments/setup_intent_create`;
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.detailSetupIntentSuccess(data.data));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.detailSetupIntentFail(err.errors));
    yield put(loadingActions.close());
  }
}
export function* saga() {
  yield takeLatest(actions.detailFetchRequest.type, detailsFetchRequest);
  yield takeLatest(actions.deleteCardRequest.type, deleteCardRequest);
  yield takeLatest(actions.updateCardRequest.type, updateCardRequest);
  yield takeLatest(actions.detailSetupIntentRequest.type, detailSetupIntentRequest);
}
