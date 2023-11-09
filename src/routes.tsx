// @mui icons
import Icon from "@mui/material/Icon";

// Images
import { AllInvoicesPage } from "pages/AllInvoices/Loadable";
import { TransactionHistoryPage } from "pages/Payments/Loadable";

export const sidebarSuperAdminRoute = [
  {
    type: "page",
    name: "Invoices",
    key: "invoices",
    icon: <Icon fontSize="medium">receipt</Icon>,
    route: "/invoices",
    component: <AllInvoicesPage />,
  },
  {
    type: "page",
    name: "Payments",
    key: "payments",
    icon: <Icon fontSize="medium">history</Icon>,
    route: "/payments",
    component: <TransactionHistoryPage />,
  },
];