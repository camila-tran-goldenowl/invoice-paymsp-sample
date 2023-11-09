import { actions } from ".";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { loadingActions } from "components/MDLoading/slice";

// api
import { IApiArguments } from "types";
import { request } from "utils/request";
import { IToastType, toastActions } from "components/Toastify/slice";

import { actions as auditLogActions } from "pages/Report/slice";

export function* detailPaymentRequest(action) {
  yield put(loadingActions.show());
  const { id } = action.payload;
  const url = `/transactions/${id}`;
  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.detailRequestSuccess(data.data));
    yield put(loadingActions.close());
  } catch (err: any) {
    yield put(actions.detailRequestFail(err.errors));
    yield put(loadingActions.close());
  }
}

export function* getAllRequest(
  action: PayloadAction<{
    customerId?: string;
    page: Number;
    pageSize: Number;
  }>
) {
  yield put(loadingActions.show());
  const { customerId, page, pageSize } = action.payload;
  const url = `/transactions`;

  const customer = customerId ? { customer_id: customerId } : {};

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
      params: { page, per: pageSize, ...customer },
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.getAllRequestSuccess(data));
  } catch (err: any) {
    yield put(actions.getAllRequestFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* sendPDFReciept(
  action: PayloadAction<{
    invoiceList: Array<string | number>;
    emailList?: Array<string>;
    subdomain?: string;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceList, actionSuccess, emailList, subdomain } = action.payload;
  const url = `/invoices/send_transaction_receipt`;

  const emailObj = emailList && emailList.length ? { email: emailList } : {};
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: {
        ids: invoiceList,
        ...emailObj,
      },
    },
    url,
    isAuthRequired: !subdomain,
    headers: {
      ...(subdomain ? { subdomain } : {}),
    },
  };

  try {
    const data = yield call(request, apiArgs);
    if (data.success) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: `Receipt${invoiceList.length > 1 ? "(s)" : ""} sent successfully`,
        })
      );
      actionSuccess?.();
      yield put(actions.sendPDFRecieptSuccess());
      yield put(
        auditLogActions.getAuditLogListRequest({
          page: 1,
          pageSize: invoiceList.length,
          type: "email",
          notification: {
            type: "sync-email",
          },
        })
      );
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Send PDF Receipt download failed",
          content: data.message,
        })
      );
      yield put(actions.sendPDFRecieptFail(data.message));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Send PDF Receipt download failed",
        content: err.errors,
      })
    );
    yield put(actions.sendPDFRecieptFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* saga() {
  yield takeLatest(actions.getAllRequest.type, getAllRequest);
  yield takeLatest(actions.detailRequest.type, detailPaymentRequest);
  yield takeLatest(actions.sendPDFRecieptRequest.type, sendPDFReciept);
}
