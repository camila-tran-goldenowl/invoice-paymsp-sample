import * as React from "react";
import { lazyLoad } from "utils/loadable";
import { LoadingIndicator } from "components/LoadingIndicator";
export const WithoutAuthRoutes = lazyLoad(
  () => import("./index"),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  }
);
