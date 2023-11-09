// type
import { IColumn } from "types/Table";
import { ICustomer } from "pages/Customer/slice/types";
import { IInvoiceDetail } from "types/Invoice";

// components
import MDBox from "components/MDBox";
import LinkCell from "components/Tables/Cell/LinkCell";
import ResourceLogo from "components/Servives/ResourceLogo";
import StatusInvoiceCell from "../components/StatusInvoiceCell";
import ActionCell from "../components/ActionCell";

export const columnsDataTable: IColumn[] = [
  {
    Header: "Invoice Number",
    accessor: "invoice_number",
    Cell: data => {
      const row: IInvoiceDetail = data.row.original;
      return <LinkCell to={`/invoices/${row.id}`}>{row.invoice_number}</LinkCell>;
    },
  },
  { Header: "Due date", accessor: "due_date" },
  {
    Header: "Status",
    accessor: "status",
    Cell: data => <StatusInvoiceCell data={data} />,
  },
  {
    Header: "Customer",
    accessor: "customer",
    Cell: ({ value: customer }: { value: ICustomer }) => {
      return <LinkCell to={`/customers/${customer.id}`}>{customer.name}</LinkCell>;
    },
  },
  {
    Header: "Total amount",
    accessor: "formatted_total_amount",
  },
  {
    Header: "Balance",
    accessor: "formatted_balance",
  },
  {
    Header: "Actions",
    accessor: "send_id",
    Cell: data => {
      const invoice: IInvoiceDetail = data.row.original;
      return <ActionCell invoice={invoice} />;
    },
  },
];

export const columnResource: IColumn = {
  Header: "Resource type",
  accessor: "resource_type",
  Cell: ({ value }: { value: string }) => {
    return (
      <MDBox display="flex" alignItems="center" mr={1}>
        <ResourceLogo service={value} />
      </MDBox>
    );
  },
};
