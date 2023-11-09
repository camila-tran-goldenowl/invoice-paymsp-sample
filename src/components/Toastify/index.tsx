/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToast } from "./slice/selectors";
import { useToastifySlice } from "./slice";
import MDSnackbar from "components/MDSnackbar";

export function Toastify() {
  const toast = useSelector(selectCurrentToast);
  const dispatch = useDispatch();
  const { actions } = useToastifySlice();

  const onClose = () => {
    dispatch(actions.clearCurrent());
  };

  return (
    <MDSnackbar
      color={toast?.type}
      title={toast?.title}
      content={toast?.content}
      open={toast?.isShow}
      dateTime=""
      onClose={onClose}
      bgWhite
    />
  );
}
