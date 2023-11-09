// libs
import moment from "moment";

// components
import StatusCell from "components/Tables/Cell/StatusCell";

// types
import { IInvoiceDetail } from "types/Invoice";

const StatusInvoiceCell = ({ data }) => {
  const row: IInvoiceDetail = data?.row?.original ?? {};
  const { due_date = "", status = "" } = row;
  let statusElm;
  const isPastDue = due_date ? moment(due_date).isBefore(moment()) : false;

  if (status === "paid") {
    statusElm = <StatusCell icon="done" color="success" status="Paid" />;
  } else if (status === "open") {
    statusElm = (
      <StatusCell icon="import_contacts" color={isPastDue ? "error" : "success"} status="Open" />
    );
  } else if (status === "scheduled") {
    statusElm = <StatusCell icon="replay" color="dark" status="Scheduled" />;
  }
  return statusElm;
};

export default StatusInvoiceCell;
