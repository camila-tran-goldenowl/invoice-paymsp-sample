import { actions } from ".";
import { IApiArguments } from "types";
import { request } from "utils/request";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import { toastActions, IToastType } from "components/Toastify/slice";
import { loadingActions } from "components/MDLoading/slice";

export function* detailsFetchRequest(
  action: PayloadAction<{
    customerId: string;
  }>
) {
  yield put(loadingActions.show());

  const url = `/payments`;
  const { customerId } = action.payload;

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
      params: { customer_id: customerId },
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

export function* deleteCardRequest(
  action: PayloadAction<{
    id: string;
    customerId: string;
  }>
) {
  yield put(loadingActions.show());
  const { id, customerId } = action.payload;

  const url = `/payments/${id}`;

  const apiArgs: IApiArguments = {
    params: {
      method: "DELETE",
      data: { customer_id: customerId },
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
      yield put(actions.detailFetchRequest({ customerId }));
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

export function* createCardRequest(
  action: PayloadAction<{
    customerId: string;
    data?: any;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { customerId, data, actionSuccess } = action.payload;

  const url = `/payments`;

  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data: {
        customer_id: customerId,
        ...data,
        default: true,
      },
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Payment Method saved`,
        })
      );
      yield put(actions.detailFetchRequest({ customerId }));
      yield put(actions.createCardSuccess());
      actionSuccess?.();
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Failed to add payment method`,
          content: data.errors,
        })
      );
      yield put(actions.createCardFail(data.errors));
    }
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: `Failed to add payment method`,
        content: err.errors,
      })
    );
    yield put(actions.createCardFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* updateCardRequest(
  action: PayloadAction<{
    data?: any;
    actionSuccess?: () => void;
    actionMessage?: string;
    id: string;
    customerId: string;
  }>
) {
  yield put(loadingActions.show());
  const { customerId, data, actionSuccess, actionMessage, id } = action.payload;

  const url = `/payments/${id}`;
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: {
        ...data,
        customer_id: customerId,
      },
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `${actionMessage} saved`,
        })
      );
      yield put(actions.updateCardSuccess(data.data));
      actionSuccess?.();
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Failed to ${actionMessage}`,
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
        title: `Failed to ${actionMessage}`,
        content: err.errors,
      })
    );
    yield put(actions.updateCardFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* saga() {
  yield takeLatest(actions.detailFetchRequest.type, detailsFetchRequest);
  yield takeLatest(actions.deleteCardRequest.type, deleteCardRequest);
  yield takeLatest(actions.createCardRequest.type, createCardRequest);
  yield takeLatest(actions.updateCardRequest.type, updateCardRequest);
}
