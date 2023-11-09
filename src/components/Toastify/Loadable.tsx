import { lazyLoad } from "utils/loadable";

export const Toastify = lazyLoad(
  () => import("./index"),
  module => module.Toastify
);
