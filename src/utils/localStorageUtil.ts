import { StorageKey } from "./constants";

export function getAuthToken() {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.authToken));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getSubdomain() {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.authSubdomain));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getTenantId() {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.authTenantId));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getRole() {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.authRole));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getCustomerId() {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.customerId));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function setAuth({ token, subdomain, tenant_id, role }) {
  localStorage.setItem(StorageKey.authToken, JSON.stringify(token));
  localStorage.setItem(StorageKey.authSubdomain, JSON.stringify(subdomain));
  localStorage.setItem(StorageKey.authTenantId, JSON.stringify(tenant_id));
  localStorage.setItem(StorageKey.authRole, JSON.stringify(role));
}

export function setKeyValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getValue(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function deleteKey(key) {
  localStorage.removeItem(key);
}

export function removeAuthToken() {
  localStorage.clear();
}
