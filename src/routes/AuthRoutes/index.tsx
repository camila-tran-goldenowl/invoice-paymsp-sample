// libs
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// store
import { useSlice as useSignInSlice } from "pages/SignInPage/slice";
import { selectSet2FA, selectIsLoggetIn } from "pages/SignInPage/slice/selectors";

function AuthRoutes() {
  const dispatch = useDispatch();
  const { actions: signInActions } = useSignInSlice();
  const isLoggedIn = useSelector(selectIsLoggetIn);
  const isHasToSetFA = useSelector(selectSet2FA);

  const location = useLocation();
  if (!isLoggedIn) {
    dispatch(signInActions.setURLDirect(window.location.pathname));
    return <Navigate to="/sign-in" />;
  } else if (isLoggedIn && isHasToSetFA && location.pathname !== "/multi-factor") {
    return <Navigate to="/multi-factor" />;
  }
  return <Outlet />;
}

export default React.memo(AuthRoutes);
