import { IAddress, defaultAddress } from "types/User";
import { IPlan } from "pages/Settings/Subscription/slice/types";
import { IPaymentGateway, defaultPaymentGateway } from "pages/Settings/PaymentGateway/slice/types";

export interface ITenantState {
  tenant: ITenant;
  loading: boolean;
  isUpdated: boolean | null;
  error?: string | null;
  setup: {
    [key: string]: any;
  };
}
interface IIntegrations {
  autotask: boolean;
  connectwise: boolean;
  quickbook: boolean;
  xero: boolean;
  quickbook_desktop: boolean;
}
export interface ITenant {
  address: IAddress;
  id: string;
  logo_url: string;
  name: string;
  timezone: string;
  currency: string;
  email: string;
  company_name: string;
  whitelabel_hosts: any;
  full_name: string;
  last_name: string;
  plan: IPlan | null;
  authorize_detail: IPaymentGateway;
  integrations: IIntegrations;
  theme_setting: IThemeSettingState;
  enforce_multifactor: boolean;
  quickbook_desktop_password: string | null;
  resources_priority: Array<any>;
  payment_gateway_name: null | "wepay" | "authorizenet";
  wepay_detail: null | {
    convenience_fee_percent: number | null;
    disable_credit_card: boolean;
  };
  wepay_account_id: null | string;
  stripe_account_id?: string | null;
  sync_processing_fee?: null | boolean;
  website_title: string;
  favicon_url: string;
}

export const defaultIntegrations: IIntegrations = {
  autotask: false,
  connectwise: false,
  quickbook: false,
  xero: false,
  quickbook_desktop: false,
};

export interface IThemeSettingState {
  miniSidenav: null | boolean;
  transparentSidenav: boolean;
  whiteSidenav: boolean;
  sidenavColor:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
  direction: "ltr" | "rtl";
  layout: "dashboard" | "page";
  darkMode: boolean;
  accountNavigation: boolean;
}

export const defaultThemeSetting: IThemeSettingState = {
  accountNavigation: false,
  darkMode: false,
  direction: "ltr",
  fixedNavbar: true,
  layout: "page",
  miniSidenav: null,
  openConfigurator: false,
  sidenavColor: "info",
  transparentNavbar: true,
  transparentSidenav: false,
  whiteSidenav: false,
};

export const defaultTenant: ITenant = {
  address: defaultAddress,
  id: "",
  logo_url: "",
  name: "",
  timezone: "",
  currency: "",
  email: "",
  company_name: "",
  whitelabel_hosts: "",
  full_name: "",
  last_name: "",
  plan: null,
  authorize_detail: defaultPaymentGateway,
  integrations: defaultIntegrations,
  theme_setting: defaultThemeSetting,
  enforce_multifactor: false,
  quickbook_desktop_password: null,
  resources_priority: [],
  payment_gateway_name: null,
  wepay_detail: null,
  wepay_account_id: null,
  stripe_account_id: null,
  sync_processing_fee: null,
  website_title: "",
  favicon_url: "",
};
