import { createSlice } from "utils/@reduxjs/toolkit";
import { ILoadingState } from "./types";
import { useInjectReducer } from "utils/redux-injectors";

export const initialState: ILoadingState = {
  isShow: false,
};

const slice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    show(state) {
      return { isShow: true };
    },
    close(state) {
      state.isShow = false;
    },
    clear: () => initialState,
  },
});

export const { actions: loadingActions, reducer: loadingReducer } = slice;

export const useLoadingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
