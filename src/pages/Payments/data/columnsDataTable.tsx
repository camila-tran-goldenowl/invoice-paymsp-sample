// components
import LinkCell from "components/Tables/Cell/LinkCell";
import StatusCell from "components/Tables/Cell/StatusCell";
import DefaultCell from "components/Tables/Cell/DefaultCell";

// types
import { ICustomer } from "pages/Customer/slice/types";

// data
import { FORMAT } from "utils/constants";

// func
import { parseTimezone } from "utils/common";

export const columnsDataTable = [
  {
    Header: "id",
    accessor: "id",
    Cell: ({ value }: any) => {
      return <LinkCell to={`/receipt?paymentId=${value}`}>{value}</LinkCell>;
    },
  },
  {
    Header: "Invoice Number",
    accessor: "invoice_number",
    Cell: data => {
      const row = data.row.original;
      return <LinkCell to={`/receipt?paymentId=${row.id}`}> {row.invoice.invoice_number}</LinkCell>;
    },
  },
  {
    Header: "date",
    accessor: "created_at",
    Cell: ({ value }: any) => parseTimezone(value, FORMAT.DATE_TIME),
  },
  {
    Header: "status",
    accessor: "status",
    Cell: ({ value }: { value: string }) => {
      let status;

      if (value === "paid") {
        status = <StatusCell icon="done" color="success" status="Paid" />;
      } else if (value === "refunded") {
        status = <StatusCell icon="replay" color="dark" status="Refunded" />;
      } else {
        status = <StatusCell icon="close" color="error" status="Canceled" />;
      }

      return status;
    },
  },
  {
    Header: "customer",
    accessor: "customer",
    Cell: ({ value: customer }: { value: ICustomer }) => {
      return <LinkCell to={`/customers/${customer.id}`}>{customer.name}</LinkCell>;
    },
  },
  {
    Header: "Amount",
    accessor: "formatted_amount",
    Cell: ({ value }: any) => <DefaultCell value={value} />,
  },
];
