// libs
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// data
import { DEFAULT_PAGE_URL } from "utils/constants";

// store
import { selectIsLoggetIn, selectPathnameDirect } from "pages/SignInPage/slice/selectors";

function WithoutAuthRoutes() {
  const isLoggedIn = useSelector(selectIsLoggetIn);
  const pathname = useSelector(selectPathnameDirect);
  if (isLoggedIn) {
    if (pathname) {
      return <Navigate to={pathname} />;
    }
    return <Navigate to={DEFAULT_PAGE_URL} />;
  }
  return <Outlet />;
}

export default React.memo(WithoutAuthRoutes);
