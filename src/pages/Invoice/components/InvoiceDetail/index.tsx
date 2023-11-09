// libs
import moment from "moment";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { toCapitalize } from "utils/common";
import { useDispatch, useSelector } from "react-redux";

// core componets
import Table from "@mui/material/Table";
import { Theme } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

// components
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";

// types
import { IInvoiceDetail } from "types/Invoice";
import { ITenant } from "components/Tenant/slice/types";

// sage
import { selectCustomer } from "pages/Customer/slice/selectors";
import { selectTenant } from "components/Tenant/slice/selectors";
import { useSlice as useCustomerSlice } from "pages/Customer/slice";

// style
import colors from "assets/theme/base/colors";

interface IInvoiceDetailProps {
  invoice: IInvoiceDetail;
  darkMode: boolean;
  styles?: { [key: string]: string };
}

const InvoiceDetail = ({ invoice, darkMode, styles }: IInvoiceDetailProps): JSX.Element => {
  const { customer: customerInvoice, receipt } = invoice;
  const dispatch = useDispatch();
  const { actions: customerActions } = useCustomerSlice();
  let feeObj,
    finalLineItems = [],
    totalAmoutCharge = "";
  if (!receipt) {
    ({ line_items: finalLineItems = [], formatted_total_amount: totalAmoutCharge = "" } = invoice);
  } else {
    ({ line_items: finalLineItems = [], formatted_amount: totalAmoutCharge } = receipt);
    feeObj = finalLineItems.find(
      item =>
        item.name.toLowerCase() === "convenience fee" || item.name.toLowerCase() === "bank discount"
    );
    finalLineItems = feeObj
      ? finalLineItems.filter(
          item =>
            item.name.toLowerCase() !== "convenience fee" &&
            item.name.toLowerCase() !== "bank discount"
        )
      : finalLineItems;
  }

  React.useEffect(() => {
    if (customerInvoice) {
      dispatch(customerActions.getDetailRequest({ customerId: customerInvoice.id }));
    }
  }, [customerActions, customerInvoice, dispatch]);

  const borderBottom = {
    borderBottom: ({ borders: { borderWidth }, palette: { light } }: Theme) =>
      `${borderWidth[1]} solid ${light.main}`,
  };
  const customer = useSelector(selectCustomer);
  const fullShippingAddress = [
    customer?.shipping_address?.address1,
    customer?.shipping_address?.address2,
    customer?.shipping_address?.city,
    customer?.shipping_address?.formatted_state,
    customer?.shipping_address?.formatted_country,
  ]
    .filter(n => n)
    .join(", ");

  const tenant: ITenant = useSelector(selectTenant);
  const address = tenant?.address;
  const fullAddress = [
    address?.address1,
    address?.address2,
    address?.city,
    address?.formatted_state,
    address?.formatted_country,
  ]
    .filter(n => n)
    .join(", ");

  return (
    <MDBox sx={{ position: "relative" }}>
      {/* Invoice header */}
      <MDBox p={3} sx={styles}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={5}>
            <MDBox textAlign="left">
              <MDBox py={1} mb={1}>
                {tenant?.logo_url && <MDBox component="img" src={tenant?.logo_url} height="2rem" />}
              </MDBox>
              <MDTypography variant="h6" fontWeight="medium">
                {tenant?.company_name}
              </MDTypography>
              <MDBox>
                {fullAddress ? (
                  <MDBox>
                    {address?.address1 && (
                      <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                        {address.address1}
                      </MDTypography>
                    )}

                    <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                      {[address?.city, address?.formatted_state].filter(n => n).join(", ")}{" "}
                      {address?.zip_code && address.zip_code}
                    </MDTypography>

                    {address?.formatted_country && (
                      <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                        {address.formatted_country}
                      </MDTypography>
                    )}
                  </MDBox>
                ) : (
                  <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                    No address information yet
                  </MDTypography>
                )}
              </MDBox>

              <MDTypography display="block" variant="body2" color={darkMode ? "text" : "secondary"}>
                Tel:{" "}
                {tenant?.address?.phone_number
                  ? tenant?.address.phone_number
                  : "No phone number information yet"}
              </MDTypography>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={5}>
            <MDBox width="100%" textAlign={{ xs: "left", md: "right" }}>
              <MDBox p={1} mb={1}>
                {tenant?.logo_url && <MDBox height="2rem" />}
              </MDBox>
              <NavLink to={`/customers/${customer?.id}`}>
                <MDTypography variant="button2" fontWeight="regular">
                  <MDTypography variant="h6" fontWeight="medium">
                    Billed to: {customer?.name}
                  </MDTypography>
                </MDTypography>
              </NavLink>

              <MDBox mb={1}>
                <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
                  {fullShippingAddress ? fullShippingAddress : "No address information yet"}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>

        {invoice.status === "paid" && (
          <MDBox width="fit-content" mx="auto">
            <MDTypography
              variant="h1"
              fontWeight="bold"
              sx={{ color: colors.success.focus, transform: "rotate(-26deg)" }}
            >
              PAID
            </MDTypography>
          </MDBox>
        )}

        <MDBox mt={{ xs: 5, md: 10 }}>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={4}>
              <MDTypography
                variant="h6"
                color={darkMode ? "text" : "secondary"}
                fontWeight="regular"
              >
                Invoice no
              </MDTypography>
              <MDTypography variant="h6" fontWeight="medium">
                {invoice.invoice_number && `#`}
                {invoice.invoice_number}
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={4}>
              <MDBox
                width="100%"
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                textAlign={{ xs: "left", md: "right" }}
                mt={{ xs: 3, md: 0 }}
              >
                <MDBox width="50%">
                  <MDTypography
                    variant="h6"
                    color={darkMode ? "text" : "secondary"}
                    fontWeight="regular"
                  >
                    {/* Invoice date: */}
                  </MDTypography>
                </MDBox>
                <MDBox width="50%">
                  <MDTypography variant="h6" fontWeight="medium">
                    {/* 06/03/2019 */}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox
                width="100%"
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                textAlign={{ xs: "left", md: "right" }}
              >
                <MDBox width="50%">
                  <MDTypography
                    variant="h6"
                    color={darkMode ? "text" : "secondary"}
                    fontWeight="regular"
                  >
                    Due date:
                  </MDTypography>
                </MDBox>
                <MDBox width="50%">
                  <MDTypography variant="h6" fontWeight="medium">
                    {invoice.due_date && moment(invoice.due_date).format("MM-DD-YYYY")}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      {/* Invoice table */}
      <MDBox p={3}>
        <MDBox width="100%" overflow="auto">
          <Table sx={{ minWidth: "32rem" }}>
            <MDBox component="thead">
              <TableRow>
                <MDBox
                  component="th"
                  width={{ xs: "45%", md: "50%" }}
                  py={1.5}
                  px={1}
                  textAlign="left"
                  sx={borderBottom}
                >
                  <MDTypography variant="h6" color="text" fontWeight="medium">
                    Item
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} pl={3} pr={1} textAlign="left" sx={borderBottom}>
                  <MDTypography variant="h6" color="text" fontWeight="medium">
                    Qty
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} pl={3} pr={1} textAlign="left" sx={borderBottom}>
                  <MDTypography variant="h6" color="text" fontWeight="medium">
                    Rate
                  </MDTypography>
                </MDBox>
                <MDBox component="th" py={1.5} pl={3} pr={1} textAlign="left" sx={borderBottom}>
                  <MDTypography variant="h6" color="text" fontWeight="medium">
                    Amount
                  </MDTypography>
                </MDBox>
              </TableRow>
            </MDBox>
            <TableBody>
              {finalLineItems.map(item => (
                <TableRow>
                  {/* name */}
                  <MDBox component="td" textAlign="left" p={1} sx={borderBottom}>
                    <MDTypography variant="body2" color="text" fontWeight="regular">
                      {item.name}
                    </MDTypography>
                  </MDBox>
                  {/* qty */}
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="body2" color="text" fontWeight="regular">
                      {item.quantity}
                    </MDTypography>
                  </MDBox>
                  {/* rate */}
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="body2" color="text" fontWeight="regular">
                      {item.formatted_unit_price}
                    </MDTypography>
                  </MDBox>
                  {/* amount */}
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="body2" color="text" fontWeight="regular">
                      {item.formatted_total_price}
                    </MDTypography>
                  </MDBox>
                </TableRow>
              ))}
              {/* formatted_total_tax */}
              <TableRow>
                <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">Total tax</MDTypography>
                </MDBox>
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">{invoice.formatted_total_tax}</MDTypography>
                </MDBox>
              </TableRow>

              {/* total */}
              <TableRow>
                <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">Total</MDTypography>
                </MDBox>
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">{invoice.formatted_total_amount}</MDTypography>
                </MDBox>
              </TableRow>

              {feeObj?.formatted_total_price && (
                <TableRow>
                  <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="h6">
                      {feeObj.name === "bank discount"
                        ? `ACH ${feeObj.total_price > 0 ? "fee" : "discount"} `
                        : toCapitalize(feeObj.name)}
                    </MDTypography>
                  </MDBox>
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="h6">{feeObj.formatted_total_price}</MDTypography>
                  </MDBox>
                </TableRow>
              )}

              {/* payments  */}
              <TableRow>
                <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">Payments</MDTypography>
                </MDBox>
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">{invoice.formatted_payments}</MDTypography>
                </MDBox>
              </TableRow>
              {/* credit  */}
              <TableRow>
                <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">Credits</MDTypography>
                </MDBox>
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">{invoice.formatted_credits}</MDTypography>
                </MDBox>
              </TableRow>
              {/* balance  */}
              <TableRow>
                <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">Balance due</MDTypography>
                </MDBox>
                <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                  <MDTypography variant="h6">{invoice.formatted_balance}</MDTypography>
                </MDBox>
              </TableRow>
              {/* total amount charged */}
              {feeObj && (
                <TableRow>
                  <MDBox component="td" textAlign="left" p={1} sx={borderBottom} />
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom} />
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="h6">Total amount charged</MDTypography>
                  </MDBox>
                  <MDBox component="td" textAlign="left" py={1} pr={1} pl={3} sx={borderBottom}>
                    <MDTypography variant="h6">{totalAmoutCharge}</MDTypography>
                  </MDBox>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default InvoiceDetail;
