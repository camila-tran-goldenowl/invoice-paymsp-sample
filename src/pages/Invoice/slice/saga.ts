import { actions } from ".";
import { IApiArguments } from "types";
import { request } from "utils/request";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { loadingActions } from "components/MDLoading/slice";
import { toastActions, IToastType } from "components/Toastify/slice";
import { ITenant } from "components/Tenant/slice/types";

export function* detailInvoiceRequest(
  action: PayloadAction<{
    id: string;
    subdomain?: string;
  }>
) {
  yield put(loadingActions.show());
  const { id, subdomain } = action.payload;
  const url = `/invoices/${id}`;

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
    },
    url,
    isAuthRequired: !subdomain,
    headers: {
      ...(subdomain ? { subdomain } : {}),
    },
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.getDetailSuccess(data));
  } catch (err: any) {
    yield put(actions.getDetailFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* chargeInvoiceRequest(
  action: PayloadAction<{
    invoiceIds: string;
    cardId: Array<string>;
    actionSuccess: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceIds, cardId, actionSuccess } = action.payload;
  const url = `/invoices/charge`;
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data: { payment_id: cardId, ids: invoiceIds },
    },
    url,
  };
  const handleErrorMessage = errors => {
    return errors.isArray ? errors.map(item => item.message).join(", ") : errors;
  };
  try {
    const response = yield call(request, apiArgs);

    if (response.success) {
      yield put(
        toastActions.notify({
          type: response.errors ? IToastType.WARNING : IToastType.SUCCESS,
          title: `Charge successful ${response.errors ? `- ${response.errors}` : ""}`,
        })
      );
      yield put(actions.chargeSuccess());
      setTimeout(() => {
        actionSuccess?.();
      }, 2000);

      yield put(actions.chargeSuccess());
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Charge failed",
          content: handleErrorMessage(response.errors),
        })
      );
      yield put(actions.chargeFail(response.errors));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Charge fail",
        content: handleErrorMessage(err.errors),
      })
    );
    yield put(actions.chargeFail(err.errors));
  }

  yield put(loadingActions.close());
}

export function* chargeWithoutInvoiceRequest(
  action: PayloadAction<{
    invoiceId: string;
    form: ITenant;
    state: string;
    subdomain: string;
    actionSuccess: (data) => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceId, form, actionSuccess, state, subdomain } = action.payload;
  const url = `/invoices/${invoiceId}/charge_without_signin?state=${state}`;
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
      data: { ...form },
    },
    headers: {
      subdomain,
    },
    url,
    isAuthRequired: false,
  };
  try {
    const response = yield call(request, apiArgs);
    if (response.success) {
      yield put(
        toastActions.notify({
          type: response.errors ? IToastType.WARNING : IToastType.SUCCESS,
          title: `Charge successful ${response.errors ? `- ${response.errors}` : ""}`,
        })
      );
      yield put(actions.chargeWithoutLoginSuccess(response.data.receipt));
      actionSuccess?.(response.data);
      if (response.errors)
        yield put(
          toastActions.notify({
            type: IToastType.WARNING,
            title: response.errors,
          })
        );
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Charge failed",
          content: response.errors,
        })
      );
      yield put(actions.chargeWithoutLoginFail(response.errors));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Charge failed",
        content: err.errors,
      })
    );
    yield put(actions.chargeWithoutLoginFail(err.errors));
  }

  yield put(loadingActions.close());
}

export function* refundInvoiceRequest(
  action: PayloadAction<{
    invoiceId: string;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceId, actionSuccess } = action.payload;
  const url = `/invoices/${invoiceId}/refund`;
  const apiArgs: IApiArguments = {
    params: {
      method: "POST",
    },
    url,
  };
  try {
    const response = yield call(request, apiArgs);
    if (response.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: "Refund successful",
        })
      );
      actionSuccess?.();
      yield put(actions.refundSuccess());
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Refund failed",
          content: response.errors,
        })
      );
      yield put(actions.refundFail(response.errors));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Refund fail",
        content: err.errors,
      })
    );
    yield put(actions.refundFail(err.errors));
  }

  yield put(loadingActions.close());
}
export function* saga() {
  yield takeLatest(actions.getDetailRequest.type, detailInvoiceRequest);
  yield takeLatest(actions.chargeRequest.type, chargeInvoiceRequest);
  yield takeLatest(actions.chargeWithoutLoginRequest.type, chargeWithoutInvoiceRequest);
  yield takeLatest(actions.refundRequest.type, refundInvoiceRequest);
}
