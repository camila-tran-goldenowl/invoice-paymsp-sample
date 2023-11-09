interface IEnv {
  [key: string]: string;
}
const ENV: IEnv = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  CRYPTO_SECRET_KEY: process.env.REACT_APP_CRYPTO_KEY,
  LANDING_PAGE_URL: process.env.REACT_APP_LANDING_PAGE_URL,
  RECAPCHA_SITE_KEY: process.env.REACT_APP_RECAPCHA_SITE_KEY,
  RECAPCHA_SECKET_KEY: process.env.REACT_APP_RECAPCHA_SECKET_KEY,
  BLUELINKS: process.env.REACT_APP_BLUELINKS,
  SENTRY_DNS: process.env.REACT_APP_SENTRY_DNS,
  WEPAY_ENV: process.env.REACT_APP_WEPAY_ENV,
  WEPAY_VERSION: process.env.REACT_APP_WEPAY_VERSION,
  WEPAY_APP_ID: process.env.REACT_APP_WEPAY_APP_ID,
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  ADMIN_HOST: process.env.REACT_APP_ADMIN_PAGE_HOST,
};

interface IStorageKey {
  authToken: string;
  authSubdomain: string;
  authTenantId: string;
  authRole: string;
  tenantInfo: string;
  customerId: string;
  authRoleSwitchBack: string;
  csrfToken: string;
}

const StorageKey: IStorageKey = {
  authToken: "@auth:token",
  authSubdomain: "@auth:subdomain",
  authRole: "@auth:role",
  authRoleSwitchBack: "@auth:role_switch_back",
  authTenantId: "@tenant:id",
  tenantInfo: "@tenant:info",
  customerId: "@customer:id",
  csrfToken: "@auth:csrf-token",
};

const LoadingStatus = {
  idle: "idle",
  pending: "pending",
  fulfilled: "fulfilled",
  rejected: "rejected",
};

const FORMAT = {
  DATE: "YYYY-MM-DD",
  TIME: "HH:mm:ss",
  DATE_TIME: "YYYY-MM-DD HH:mm:ss",
};

export const INTEGRATED_PARAMS = "integrated";

export const BILLING_CYCLE = {
  monthly: "monthly",
  annually: "annually",
};

const PLANS_VALUE = {
  starter: 0,
  premium: 1,
  enterprise: 2,
};

export const PLANS = {
  starter: "starter",
  premium: "premium",
  enterprise: "enterprise",
};

export const DISCOUNT = {
  percent: "percent",
  value: "value",
};

export const DEFAULT_PLAN = PLANS.starter;
export const DEFAULT_BILLING_CYCLE = BILLING_CYCLE.monthly;

const PAGE_SIZE_DEFAULT = 25;
const NUMBER_PAGE_SHOW = 6;
const PAGE_DEFAULT: Number = 1;
const ENTRIES_PER_PAGE_DEFAULT = [25, 50, 100];

const PAYMENT_TYPE = {
  card: "card",
  bank: "bank",
};

const SERVICES = {
  connectwise: "connectwise",
  quickbooks: "quickbook",
  quickbooksDesktop: "quickbook_desktop",
  xero: "xero",
  autotask: "autotask",
};

const PSA_SERVICES = [SERVICES.connectwise, SERVICES.autotask];
const ACCOUNTING_SERVICES = [SERVICES.quickbooks, SERVICES.quickbooksDesktop, SERVICES.xero];

const SERVICES_LABEL = {
  connectwise: "Connectwise",
  quickbook: "Quickbooks",
  quickbook_desktop: "Quickbooks Desktop",
  xero: "Xero",
  autotask: "Autotask",
};

// roles
const ROLES = {
  admin: "admin",
  super_admin: "super_admin",
  user: "user",
  client: "client",
};
const TENANT_ROLES = [ROLES.admin, ROLES.super_admin, ROLES.user];
const ADMIN_GROUP_TENANT_ROLES = [ROLES.admin, ROLES.super_admin];

const DEFAULT_FREQUENCY_INTERGRATE = 60;

const STATUS = {
  success: "success",
  fail: "fail",
  error: "error",
};

const INVOICE_STATUS = {
  open: "open",
  paid: "paid",
};

const DEFAULT_PAGE_URL = "/dashboard";

const GATEWAY = {
  authorize: "authorizenet",
  wepay: "wepay",
  stripe: "stripe",
};

const CANADA_CODE = "CA";
const COUNTRY_DEFAULT = "US";

const PRIORITY_FEE = {
  customer: "customer",
  global: "global",
};

const STRIPE_COUNTRY_SUPPORT = [
  "AT",
  "AU",
  "BE",
  "BR",
  "BG",
  "CA",
  "CY",
  "DK",
  "EE",
  "FI",
  "FR",
  "HK",
  "GR",
  "HG",
  "IN",
  "IT",
  "JP",
  "MX",
  "SE",
  "SG",
  "NO",
  "MY",
  "MT",
  "PL",
  "PT",
  "RO",
  "AE",
  "UK",
  "SK",
  "SI",
  "ES",
  "CH",
  "NZ",
  "NL",
  "LU",
  "LT",
  "LV",
  "IE",
  "DE",
  "CZ",
  "TH",
  "ID",
  "GR",
  "GI",
  "HR",
  "US",
];

export {
  ENV,
  StorageKey,
  LoadingStatus,
  FORMAT,
  PAGE_SIZE_DEFAULT,
  PAGE_DEFAULT,
  NUMBER_PAGE_SHOW,
  ENTRIES_PER_PAGE_DEFAULT,
  PAYMENT_TYPE,
  SERVICES,
  PSA_SERVICES,
  ACCOUNTING_SERVICES,
  ROLES,
  TENANT_ROLES,
  ADMIN_GROUP_TENANT_ROLES,
  DEFAULT_FREQUENCY_INTERGRATE,
  SERVICES_LABEL,
  STATUS,
  PLANS_VALUE,
  INVOICE_STATUS,
  DEFAULT_PAGE_URL,
  GATEWAY,
  CANADA_CODE,
  COUNTRY_DEFAULT,
  STRIPE_COUNTRY_SUPPORT,
  PRIORITY_FEE,
};
