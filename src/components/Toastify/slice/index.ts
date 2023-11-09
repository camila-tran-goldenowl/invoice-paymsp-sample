import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { IToastifyState, IToastType, IToastify } from "./types";
import { useInjectReducer } from "utils/redux-injectors";

import take from "lodash/take";

export const initialState: IToastifyState = {
  list: [],
  current: {
    content: "",
    title: "",
    isShow: false,
    isRead: false,
  },
};

const slice = createSlice({
  name: "toastify",
  initialState,
  reducers: {
    notify(state, action: PayloadAction<IToastify>) {
      state.current.type = action.payload.type;
      state.current.title = action.payload.title;
      state.current.content = action.payload.content;
      state.current.isShow = true;
      state.current.isRead = false;
      let list = [...state.list, action.payload];
      state.list = take(list, 5);
    },
    addList(state, action: PayloadAction<Array<IToastify>>) {
      let list = action.payload;
      list = [...state.list, ...list];
      state.list = take(list, 5);
    },
    clearNotifyList(state) {
      const markedReadList = [...state.list].map(item => ({ ...item, isRead: true }));
      state.list = markedReadList;
    },
    clearCurrent(state) {
      state.current = {
        content: "",
        title: "",
        isShow: false,
      };
    },
  },
});

export { IToastType };

export const { actions: toastActions, reducer: toastReducer } = slice;

export const useToastifySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
