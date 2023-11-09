// libs
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatPhoneNumber } from "utils/common";

// core componets
import Table from "@mui/material/Table";
import { Theme } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

// components
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";

// data
import { GATEWAY } from "utils/constants";

// saga
import { selectGatewayType } from "components/Tenant/slice/selectors";

const RecieptDetail = ({ receipt, darkMode, tenant }): JSX.Element => {
  const { invoice, line_items: finalLineItems = [], payment, customer } = receipt;

  const feeObj = finalLineItems.find(item => item.name.toLowerCase() === "convenience fee");
  const achDiscountObj = finalLineItems.find(item => item.name === "bank discount");

  const borderBottom = {
    borderBottom: ({ borders: { borderWidth }, palette: { grey } }: Theme) =>
      `${borderWidth[1]} solid ${grey[400]}`,
  };

  const billingAddress = payment?.address ?? customer?.billing_address;
  const fullShippingAddress = [
    billingAddress?.address1,
    billingAddress?.address2,
    billingAddress?.city,
    billingAddress?.formatted_state,
    billingAddress?.formatted_country,
  ]
    .filter(n => n)
    .join(", ");

  const gateway = useSelector(selectGatewayType);
  const tenantAddress = tenant?.address;
  const fullAddress = [
    tenantAddress?.address1,
    tenantAddress?.address2,
    tenantAddress?.city,
    tenantAddress?.formatted_state,
    tenantAddress?.formatted_country,
  ]
    .filter(n => n)
    .join(", ");

  const MDTypographyReciept = ({ children }) => {
    return (
      <MDTypography variant="body2" color={darkMode ? "text" : "secondary"}>
        {children}
      </MDTypography>
    );
  };

  return (
    <MDBox>
      {/* Invoice header */}
      <MDBox p={3}>
        {/* Tenant  */}
        <Grid container justifyContent="space-between">
          <Grid item xs={12}>
            <MDBox textAlign="left">
              <MDTypography variant="h5" fontWeight="medium" color="info">
                {tenant?.company_name ? `Merchant: ${tenant.company_name}` : ""}
              </MDTypography>
              <Grid container>
                <Grid item xs={12} md={7}>
                  <MDBox>
                    {fullAddress ? (
                      <MDBox>
                        {tenantAddress?.address1 && (
                          <MDTypographyReciept>{tenantAddress.address1}</MDTypographyReciept>
                        )}

                        <MDTypographyReciept>
                          {[tenantAddress?.city, tenantAddress?.formatted_state]
                            .filter(n => n)
                            .join(", ")}{" "}
                          {tenantAddress?.zip_code && tenantAddress.zip_code}
                        </MDTypographyReciept>

                        {tenantAddress?.formatted_country && (
                          <MDTypographyReciept>
                            {tenantAddress.formatted_country}
                          </MDTypographyReciept>
                        )}
                      </MDBox>
                    ) : (
                      <MDTypographyReciept>No address information yet</MDTypographyReciept>
                    )}
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <MDTypography
                    display="block"
                    variant="body2"
                    color={darkMode ? "text" : "secondary"}
                  >
                    Tel:{" "}
                    {tenantAddress?.phone_number
                      ? formatPhoneNumber(tenantAddress.phone_number)
                      : "No phone number information yet"}
                  </MDTypography>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>

          <Grid item xs={12}>
            <MDTypographyReciept>Order Information</MDTypographyReciept>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDTypographyReciept>Order Number: </MDTypographyReciept>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDTypographyReciept>P.O Number: </MDTypographyReciept>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDTypographyReciept>Customer Name: {customer?.name}</MDTypographyReciept>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDTypographyReciept>Invoice Number: {invoice?.invoice_number}</MDTypographyReciept>
          </Grid>
        </Grid>

        {/* Customer */}
        <MDBox my={2} px={1} textAlign="left" sx={borderBottom}></MDBox>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <MDTypography variant="h6" fontWeight="medium">
              Billing Information
            </MDTypography>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDTypography variant="h6" fontWeight="medium">
              Shipping Information
            </MDTypography>
          </Grid>
          <Grid item xs={12} md={6}>
            <NavLink to={`/customers/${customer?.id}`}>
              <MDTypographyReciept>{customer?.name}</MDTypographyReciept>
            </NavLink>

            {fullShippingAddress ? (
              <MDBox>
                {billingAddress?.address1 && (
                  <MDTypographyReciept>{billingAddress.address1}</MDTypographyReciept>
                )}

                <MDTypographyReciept>
                  {[billingAddress?.city, billingAddress?.formatted_state]
                    .filter(n => n)
                    .join(", ")}{" "}
                  {billingAddress?.zip_code && billingAddress.zip_code}
                </MDTypographyReciept>

                {billingAddress?.formatted_country && (
                  <MDTypographyReciept>{billingAddress.formatted_country}</MDTypographyReciept>
                )}
              </MDBox>
            ) : (
              <MDTypographyReciept>No address information yet</MDTypographyReciept>
            )}
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>

        <MDBox my={2} px={1} textAlign="left" sx={borderBottom}></MDBox>

        {/* Amount Table */}
        <MDBox width="100%" overflow="auto">
          <Table>
            <TableBody>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Shipping:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>0</MDTypographyReciept>
                </MDBox>
              </TableRow>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Tax:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{invoice?.formatted_total_tax}</MDTypographyReciept>
                </MDBox>
              </TableRow>

              {achDiscountObj?.formatted_total_price && (
                <TableRow>
                  <MDBox component="td">
                    <MDTypographyReciept>
                      ACH {achDiscountObj?.total_price_value > 0 ? " fee" : " discount"}:
                    </MDTypographyReciept>
                  </MDBox>
                  <MDBox component="td" textAlign="left">
                    <MDTypographyReciept>
                      {achDiscountObj.formatted_total_price}
                    </MDTypographyReciept>
                  </MDBox>
                </TableRow>
              )}

              {feeObj?.formatted_total_price && (
                <TableRow>
                  <MDBox component="td">
                    <MDTypographyReciept>Convenience fee:</MDTypographyReciept>
                  </MDBox>
                  <MDBox component="td" textAlign="left">
                    <MDTypographyReciept>{feeObj.formatted_total_price}</MDTypographyReciept>
                  </MDBox>
                </TableRow>
              )}

              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Total:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{receipt?.formatted_amount}</MDTypographyReciept>
                </MDBox>
              </TableRow>
            </TableBody>
          </Table>
        </MDBox>

        {/* Payment  */}
        <MDBox width="100%" overflow="auto" mt={10}>
          <MDTypographyReciept>Payment Information</MDTypographyReciept>
          <Table>
            <TableBody>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Date/Time:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{payment?.created_at}</MDTypographyReciept>
                </MDBox>
              </TableRow>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Transaction ID:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>
                    {receipt?.transaction_id ?? receipt?.wepay_payment_id}
                  </MDTypographyReciept>
                </MDBox>
              </TableRow>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Transaction Type:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{receipt?.transaction_type ?? ""}</MDTypographyReciept>
                </MDBox>
              </TableRow>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Transaction Status:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{receipt?.transaction_status}</MDTypographyReciept>
                </MDBox>
              </TableRow>
              {gateway === GATEWAY.wepay ?? (
                <TableRow>
                  <MDBox component="td">
                    <MDTypographyReciept>Authorize Code:</MDTypographyReciept>
                  </MDBox>
                  <MDBox component="td" textAlign="left">
                    <MDTypographyReciept>{receipt?.authorization_code}</MDTypographyReciept>
                  </MDBox>
                </TableRow>
              )}
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Payment Card Name :</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>{receipt?.name}</MDTypographyReciept>
                </MDBox>
              </TableRow>
              <TableRow>
                <MDBox component="td">
                  <MDTypographyReciept>Payment Method:</MDTypographyReciept>
                </MDBox>
                <MDBox component="td" textAlign="left">
                  <MDTypographyReciept>
                    {payment?.card_type} XXXX{payment?.last_4digits}
                  </MDTypographyReciept>
                </MDBox>
              </TableRow>
            </TableBody>
          </Table>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default RecieptDetail;
