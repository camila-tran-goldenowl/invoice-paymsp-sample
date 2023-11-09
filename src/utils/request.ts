/* eslint-disable no-restricted-globals */
import axios, { AxiosRequestHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { IApiResponse } from "types";
import logger from "./logger";
import { actions as signInPageActions } from "pages/SignInPage/slice";
import store from "store";
import { ENV, StorageKey } from "./constants";
import { IApiArguments } from "types";
import { getAuthToken, getSubdomain, getValue, setKeyValue } from "./localStorageUtil";
import { subdomain } from "./helperFunc";

import isEmpty from "lodash/isEmpty";

export async function request(apiArgs: IApiArguments): Promise<IApiResponse> {
  const { url, params = {}, isAuthRequired = true, isSubdomain = true } = apiArgs;
  const resp: IApiResponse = { success: false, errors: "Error occured, please try again" };

  // Reading token and subdomain from localStorage
  const authToken = getAuthToken();
  const subdomainHeader = getSubdomain() ?? subdomain;

  let headers: AxiosRequestHeaders = {};

  if (isAuthRequired) {
    if (!authToken) {
      store.dispatch(signInPageActions.signOutSuccess());
      resp.errors = "Login is required";
      throw resp;
    }

    headers.Authorization = `Bearer ${authToken}`;
    const csrfToken = getValue(StorageKey.csrfToken);
    headers["X-CSRF-Token"] = csrfToken;
  }

  if (isSubdomain) {
    if (subdomainHeader) headers.subdomain = subdomainHeader;
  }

  if (params.headers && !isEmpty(params.headers)) {
    headers = { ...headers, ...params.headers };
  }

  const apiUrl = url.includes("http") ? url : `${ENV.API_BASE_URL}${url}`;

  // Setting API parameters
  const apiParams: AxiosRequestConfig = {
    ...params,
    url: apiUrl,
    headers,
    withCredentials: true,
  };

  try {
    const resp: AxiosResponse = await axios(apiParams);
    resp.headers["x-csrf-token"] && setKeyValue(StorageKey.csrfToken, resp.headers["x-csrf-token"]);
    return resp.data;
  } catch (error: any) {
    logger.error("[Request] Error: ", error.response.data?.errors, error.response.status);
    if (error.response.status === 401) {
      logger.error("[Request] Signout");
      store.dispatch(signInPageActions.signOutSuccess());
    }
    if (error?.response?.data) throw error?.response?.data;
    throw resp;
  }
}

export function hanleErrorMessage(err) {
  return err.errors.isArray ? err.errors.join(", ") : err.errors;
}
