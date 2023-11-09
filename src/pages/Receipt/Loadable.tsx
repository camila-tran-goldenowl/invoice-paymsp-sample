/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from "utils/loadable";

export const RecieptPage = lazyLoad(
  () => import("./index"),
  module => module.RecieptPage
);
