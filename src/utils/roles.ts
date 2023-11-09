import { getRole } from "utils/localStorageUtil";
import { ROLES, TENANT_ROLES, ADMIN_GROUP_TENANT_ROLES } from "utils/constants";

export const isSuperAdminRole = () => {
  return getRole() === ROLES.super_admin;
};

export const isAdminRole = () => {
  return getRole() === ROLES.admin;
};

export const isClientRole = () => {
  return getRole() === ROLES.client;
};

export const isUserRole = () => {
  return getRole() === ROLES.user;
};

export const isAdminGroup = (value = getRole()) => {
  return ADMIN_GROUP_TENANT_ROLES.includes(value);
};

export const isTenantAccount = () => {
  return TENANT_ROLES.includes(getRole());
};

export const isClientAccount = () => {
  return getRole() === ROLES.client;
};
