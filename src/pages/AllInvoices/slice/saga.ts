import { actions } from ".";
import { IApiArguments } from "types";
import { request } from "utils/request";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { loadingActions } from "components/MDLoading/slice";
import { IToastType, toastActions } from "components/Toastify/slice";
import { actions as auditLogActions } from "pages/Report/slice";

export function* detailInvoiceRequest(
  action: PayloadAction<{
    customerId?: string;
    filter?: string;
    searchText?: string;
    page: Number;
    pageSize: Number;
    orderBy?: string;
    sortDirection?: "asc" | "desc";
  }>
) {
  yield put(loadingActions.show());
  const {
    customerId,
    searchText,
    filter,
    page,
    pageSize,
    orderBy = "date",
    sortDirection = "desc",
  } = action.payload;
  const url = `/invoices`;
  let status = {};
  if (filter) {
    status = filter === "pastdue" ? { past_due: true } : { status: filter };
  }
  const customer = customerId ? { customer_id: customerId } : {};
  const search = searchText ? { search: searchText } : {};

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
      params: {
        page,
        per: pageSize,
        ...search,
        ...customer,
        ...status,
        order_by: orderBy,
        sort_direction: sortDirection,
      },
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    yield put(actions.getDetailSuccess(data));
  } catch (err: any) {
    yield put(actions.getDetailFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* downloadInvoiceList(
  action: PayloadAction<{
    actionSuccess: (data) => void;
    customerId?: string;
    filter?: string;
    searchText?: string;
  }>
) {
  yield put(loadingActions.show());
  const { actionSuccess, customerId, searchText, filter } = action.payload;

  let url = `/invoices/export_csv`;
  let status = {};
  if (filter) {
    status = filter === "pastdue" ? { past_due: true } : { status: filter };
  }
  const customer = customerId ? { customer_id: customerId } : {};
  const search = searchText ? { search: searchText } : {};

  const apiArgs: IApiArguments = {
    params: {
      method: "GET",
      params: { ...search, ...customer, ...status },
    },
    url,
  };

  try {
    const data = yield call(request, apiArgs);
    if (data) {
      yield put(
        toastActions.notify({
          type: IToastType.SUCCESS,
          title: "Invoices downloaded",
        })
      );
      actionSuccess?.(data);
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Invoices download failed",
          content: data.message,
        })
      );
      yield put(actions.exportCSVInvoiceFail(data.message));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Invoices download failed",
        content: err.errors,
      })
    );
    yield put(actions.exportCSVInvoiceFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* deleteInvoice(
  action: PayloadAction<{
    id: string;
    customerId?: string;
    filter?: string;
    searchText?: string;
    page: Number;
    pageSize: Number;
  }>
) {
  yield put(loadingActions.show());
  const { id, customerId, searchText, filter, page, pageSize } = action.payload;
  const url = `/invoices/${id}`;

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
          title: "Invoice deleted",
        })
      );
      yield put(actions.getDetailRequest({ customerId, searchText, filter, page, pageSize }));
      yield put(actions.deleteInvoiceSuccess());
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Deletion failed",
          content: data.message,
        })
      );
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Deletion failed",
        content: err.errors,
      })
    );
    yield put(actions.exportCSVInvoiceFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* sendPDFInvoice(
  action: PayloadAction<{
    invoiceList: Array<string | number>;
    emailList?: Array<string>;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceList, actionSuccess, emailList = [] } = action.payload;
  const url = `/invoices/send_pdf`;

  const emails = emailList.length ? { email: emailList } : {};
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: {
        ids: invoiceList,
        ...emails,
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
          title: "Invoice(s) sent successfully",
        })
      );
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
      yield put(actions.sendPDFInvoiceSuccess());
      actionSuccess?.();
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Send PDF Invoice download failed",
          content: data.message,
        })
      );
      yield put(actions.sendPDFInvoiceFail(data.message));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Send PDF Invoice download failed",
        content: err.errors,
      })
    );
    yield put(actions.sendPDFInvoiceFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* sendPaynowInvoice(
  action: PayloadAction<{
    invoiceList: Array<string | number>;
    emailList?: Array<string>;
    actionSuccess?: () => void;
  }>
) {
  yield put(loadingActions.show());
  const { invoiceList, actionSuccess, emailList = [] } = action.payload;
  const url = `/invoices/send_paynow_url`;

  const emails = emailList.length ? { email: emailList } : {};
  const apiArgs: IApiArguments = {
    params: {
      method: "PUT",
      data: {
        ids: invoiceList,
        ...emails,
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
          title: "Invoice(s) sent successfully",
        })
      );
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
      yield put(actions.sendPDFInvoiceSuccess());
      actionSuccess?.();
    } else {
      yield put(
        toastActions.notify({
          type: IToastType.ERROR,
          title: "Send Paynow URL failed",
          content: data.message,
        })
      );
      yield put(actions.sendPaynowInvoiceFail(data.message));
    }
  } catch (err: any) {
    yield put(
      toastActions.notify({
        type: IToastType.ERROR,
        title: "Send Paynow URL failed",
        content: err.errors,
      })
    );
    yield put(actions.sendPaynowInvoiceFail(err.errors));
  }
  yield put(loadingActions.close());
}

export function* saga() {
  yield takeLatest(actions.getDetailRequest.type, detailInvoiceRequest);
  yield takeLatest(actions.exportCSVInvoiceRequest.type, downloadInvoiceList);
  yield takeLatest(actions.deleteInvoiceRequest.type, deleteInvoice);
  yield takeLatest(actions.sendPDFInvoiceRequest.type, sendPDFInvoice);
  yield takeLatest(actions.sendPaynowInvoiceRequest.type, sendPaynowInvoice);
}
