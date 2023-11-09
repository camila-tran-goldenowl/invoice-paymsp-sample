import { createSlice } from "utils/@reduxjs/toolkit";
import { IModalState } from "./types";
import { useInjectReducer } from "utils/redux-injectors";

export const initialState: IModalState = {
  data: null,
  name: null,
};

const slice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    open(state, action) {
      const { name, data = null, action: callback = null } = action.payload;
      state.name = name;
      state.data = data;
      state.action = callback;
    },
    close(state, action) {
      const isRefresh = action.payload?.isRefresh || false;
      const { action: actionState } = state;
      actionState && isRefresh && actionState();
      state.data = null;
      state.name = null;
    },
    clear: () => initialState,
  },
});

export const { actions: modalActions, reducer: modalReducer } = slice;

export const useModalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
