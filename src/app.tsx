/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { Helmet } from "react-helmet";
import * as Sentry from "@sentry/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// guard route
import { AuthRoutes } from "routes/AuthRoutes/Loadable";
import { WithoutAuthRoutes } from "routes/WithoutAuthRoutes/Loadable";

// core component
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// components
import Sidenav from "components/Sidenav";
import MDLoading from "components/MDLoading";
import { Toastify } from "components/Toastify";

// Themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// store
import { useModalSlice } from "components/MDModal/slice";
import { selectTenant } from "components/Tenant/slice/selectors";
import { useSlice as useSignInSlice } from "pages/SignInPage/slice";
import { selectIsLoggetIn } from "pages/SignInPage/slice/selectors";
import { useSlice as useTenantSlice } from "components/Tenant/slice";
import { selectThemeSetting } from "components/Tenant/slice/selectors";

// Routes - Sidebar
import getRoutes from "routes/getRoutes";
import { sidebarSuperAdminRoute as routes } from "routes";

// Page
import { InvoicePage } from "pages/Invoice/Loadable";
import { SignInPage } from "pages/SignInPage/Loadable";
import { RecieptPage } from "pages/Receipt/Loadable";

// utils
import { isTenantAccount } from "utils/roles";
import { isPayMSPPage } from "utils/helperFunc";
import { DEFAULT_PAGE_URL } from "utils/constants";

declare global {
  interface Window {
    usetifulTags: IUserUsetiful;
  }
}

interface IUserUsetiful {
  userId: string;
}

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const tenant = useSelector(selectTenant);
  const { miniSidenav, direction, sidenavColor, darkMode } = useSelector(selectThemeSetting);

  const logo = tenant?.logo_url;

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: signInActions } = useSignInSlice();
  const { actions: tenantActions } = useTenantSlice();
  const isShowUsetiful = isTenantAccount() && Boolean(tenant?.id);

  useEffect(() => {
    if (isShowUsetiful) {
      const script = document.createElement("script");
      script.src = "/usetiful.js";
      window.usetifulTags = { userId: tenant.id };
      script.async = true;
      script.id = "usetiful";
      document.body.appendChild(script);
    }
  }, [isShowUsetiful]);

  const isLoggetIn = useSelector(selectIsLoggetIn);

  useEffect(() => {
    dispatch(signInActions.detailsFetchRequest());
    if (isLoggetIn) {
      dispatch(tenantActions.detailsFetchRequest());
    }
  }, [isLoggetIn]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      dispatch(tenantActions.updateThemeRequest({ miniSidenav: false }));
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter && !miniSidenav) {
      dispatch(tenantActions.updateThemeRequest({ miniSidenav: true }));
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const idleTimer = useIdleTimer({
    timeout: 1000 * 60 * 10,
    crossTab: true,
    onIdle: (event, idleTimer) => {
      dispatch(modalActions.open({ name: "warning-modal" }));
    },
  });

  useEffect(() => {
    if (isLoggetIn) {
      idleTimer.start();
    } else {
      idleTimer.reset();
      idleTimer.pause();
    }
  }, [isLoggetIn]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Helmet>
        {!isPayMSPPage && tenant?.website_title && <title>{tenant.website_title}</title>}
        {!isPayMSPPage && tenant?.favicon_url && (
          <link rel="icon" type="image/x-icon" href={tenant.favicon_url} />
        )}
      </Helmet>
      {isLoggetIn && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={logo}
            brandName=""
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Toastify />
      <MDLoading />

      {/* <DefaultRoutes /> */}
      <SentryRoutes>
        <Route element={<WithoutAuthRoutes />}>
          <Route path="sign-in" element={<SignInPage />} />
        </Route>

        <Route element={<AuthRoutes />}>
          {getRoutes(routes)}

          <Route path="/receipt" element={<RecieptPage />} />
  
          <Route path="/invoices/:invoiceId" element={<InvoicePage />} />
          <Route path="*" element={<Navigate to={DEFAULT_PAGE_URL} />} />
        </Route>
      </SentryRoutes>
    </ThemeProvider>
  );
}

export default Sentry.withProfiler(App);
