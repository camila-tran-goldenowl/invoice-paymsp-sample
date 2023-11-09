/* eslint-disable no-restricted-globals */
import { getRole, setKeyValue, deleteKey, getValue } from "utils/localStorageUtil";
import { ENV, StorageKey } from "utils/constants";
import { isAdminGroup } from "./roles";

export function switchTo({ customerId }) {
  const currentRole = getRole();
  let pathname = "/";
  switch (currentRole) {
    case "client":
      const switchRole = getValue(StorageKey.authRoleSwitchBack);
      setKeyValue(StorageKey.authRole, switchRole);
      pathname = `customers/${getValue(StorageKey.customerId)}`;
      deleteKey(StorageKey.customerId);
      deleteKey(StorageKey.authRoleSwitchBack);
      break;
    default: {
      if (isAdminGroup(currentRole)) {
        setKeyValue(StorageKey.authRole, "client");
        setKeyValue(StorageKey.authRoleSwitchBack, currentRole);
        setKeyValue(StorageKey.customerId, customerId);
      }
      break;
    }
  }
  location.pathname = pathname;
}

export const subdomain = location.hostname.split(".")[0];
export const hostname = location.hostname;

export const isAdminPage = ["www", "admin"].includes(subdomain);

export const isPayMSPPage = hostname.includes(ENV.ADMIN_HOST);
