// libs
import { useDispatch } from "react-redux";
import useGatewayCheck from "hooks/useGatewayCheck";

// core components
import Tooltip from "@mui/material/Tooltip";

// components
import MDBox from "components/MDBox";

// icon
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidIcon from "@mui/icons-material/CurrencyExchange";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// saga
import { useModalSlice } from "components/MDModal/slice";
import { useSlice as useInvoicesSlice } from "../../slice";

// func
import { isAdminGroup } from "utils/roles";
import { INVOICE_STATUS } from "utils/constants";
import colors from "assets/theme/base/colors";

const ActionCell = ({ invoice }) => {
  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: invoicesActions } = useInvoicesSlice();
  const gatewayBoarding = useGatewayCheck();

  const invoiceId = invoice?.id ?? "";
  const billingAddress = invoice?.customer?.email ?? "";
  const isSentInvoicePDF = invoice?.sent_invoice_pdf ?? false;
  const isSentReciept = invoice?.sent_invoice_receipt ?? false;
  const isSentPayNowURL = invoice?.sent_paynow_url ?? false;

  const sendInvoice = () => {
    gatewayBoarding.check({
      action: () => {
        dispatch(
          modalActions.open({ name: "invoice-email-modal", data: { invoiceId, billingAddress } })
        );
      },
    });
    dispatch(
      modalActions.open({ name: "invoice-email-modal", data: { invoiceId, billingAddress } })
    );
  };

  const deleteInvoice = () => {
    dispatch(
      invoicesActions.deleteInvoiceRequest({
        page: 1,
        pageSize: 10,
        id: invoiceId,
      })
    );
  };

  const payInvoice = () => {
    dispatch(modalActions.open({ name: "pay-now-modal", data: { invoiceIds: [invoiceId] } }));
  };

  const sendReciept = () => {
    dispatch(
      modalActions.open({ name: "reciept-email-modal", data: { invoiceId, billingAddress } })
    );
  };

  const sendPDF = () => {
    dispatch(modalActions.open({ name: "pdf-email-modal", data: { invoiceId, billingAddress } }));
  };
  return (
    <MDBox>
      {isAdminGroup() ? (
        <MDBox display="flex" alignItems="center">
          <MDBox sx={{ cursor: "pointer" }} onClick={sendInvoice}>
            <Tooltip title={isSentPayNowURL ? "Resend Invoice" : "Send Invoice"} placement="top">
              <SendIcon sx={{ color: isSentPayNowURL ? colors.success.main : colors.black.main }} />
            </Tooltip>
          </MDBox>
          <MDBox sx={{ cursor: "pointer" }} onClick={sendPDF} ml={1}>
            <Tooltip title={isSentInvoicePDF ? "Resend PDF" : "Send PDF"} placement="top">
              <PictureAsPdfIcon
                sx={{
                  color: isSentInvoicePDF ? colors.success.main : colors.black.main,
                }}
              />
            </Tooltip>
          </MDBox>
          {invoice.status === INVOICE_STATUS.open && (
            <MDBox ml={1} sx={{ cursor: "pointer" }} onClick={deleteInvoice}>
              <Tooltip title="Delete" placement="top">
                <DeleteIcon />
              </Tooltip>
            </MDBox>
          )}
          {invoice.status === INVOICE_STATUS.paid && invoice.reciept !== null && (
            <MDBox ml={1} sx={{ cursor: "pointer" }} onClick={sendReciept}>
              <Tooltip title={isSentReciept ? "Resend Receipt" : "Send Receipt"} placement="top">
                <ReceiptIcon
                  sx={{ color: isSentReciept ? colors.success.main : colors.black.main }}
                />
              </Tooltip>
            </MDBox>
          )}
        </MDBox>
      ) : (
        invoice.status === INVOICE_STATUS.open && (
          <MDBox ml={1} sx={{ cursor: "pointer" }} onClick={payInvoice}>
            <Tooltip title="Pay now" placement="top">
              <PaidIcon fontSize="small" />
            </Tooltip>
          </MDBox>
        )
      )}
    </MDBox>
  );
};

export default ActionCell;
