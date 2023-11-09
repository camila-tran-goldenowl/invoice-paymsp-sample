import { saga } from "./saga";
// type
import { IPaymentMethodState } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

export const initialState: IPaymentMethodState = {
  error: null,
  loading: false,
  data: [],
  default: null,
};

const slice = createSlice({
  name: "paymentMethodCustomer",
  initialState,
  reducers: {
    detailFetchRequest(
      state,
      action: PayloadAction<{
        customerId: string;
      }>
    ) {
      state.loading = true;
    },
    detailFetchSuccess(state, action: PayloadAction<any>) {
      const { data } = action.payload;
      const defaultCard = data.find(item => item.default === true) || null;

      const defaultCardIndex = data.findIndex(item => item.default === true);
      let sortedList = [...data];
      if (defaultCardIndex !== -1) {
        sortedList.splice(defaultCardIndex, 1);
        sortedList = [defaultCard, ...sortedList];
      }
      state.data = sortedList;
      state.default = defaultCard;
      state.loading = false;
    },
    detailsFetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createCardRequest(
      state,
      action: PayloadAction<{
        customerId: string;
        data?: any;
        actionSuccess?: () => void;
      }>
    ) {
      state.loading = true;
    },
    createCardSuccess(state) {
      state.loading = false;
    },
    createCardFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateCardRequest(
      state,
      action: PayloadAction<{
        data?: any;
        actionSuccess?: () => void;
        actionMessage?: string;
        id: string;
        customerId: string;
      }>
    ) {
      state.loading = true;
    },
    updateCardSuccess(state, action) {
      state.loading = false;
      const list = [...state.data];
      state.default = list.find(item => item.id === action.payload.id) ?? null;
    },
    updateCardFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCardRequest(
      state,
      action: PayloadAction<{
        id: string;
        customerId: string;
      }>
    ) {
      state.loading = true;
    },
    deleteCardSuccess(state) {
      state.loading = false;
    },
    deleteCardFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { actions, reducer } = slice;

export const useSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga });
  return { actions: slice.actions };
};
