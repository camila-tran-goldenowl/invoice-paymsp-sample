/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useDarkmode } from "hooks/useDarkmode";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

// core components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// components
import MDBox from "components/MDBox";
import MDModal from "components/MDModal";
import MDButton from "components/MDButton";
import PaymentNow from "./components/PaymentNowForm";
import MDTypography from "components/MDTypography";
import InvoiceDetail from "./components/InvoiceDetail";
import DashboardLayout from "components/LayoutContainer/DashboardLayout";

// api
import { IApiArguments } from "types";
import { request } from "utils/request";

// type
import { exportToFile } from "utils/exportFile";
import { ITenant, defaultTenant } from "components/Tenant/slice/types";

// store
import { selectInvoice } from "./slice/selectors";
import { useSlice as useInvoiceInvoice } from "./slice";
import { useModalSlice } from "components/MDModal/slice";
import { useLoadingSlice } from "components/MDLoading/slice";
import { selectUser } from "pages/SignInPage/slice/selectors";
import { selectModal } from "components/MDModal/slice/selectors";

export function InvoicePage(): JSX.Element {
  const { invoiceId } = useParams();
  const [isChargeSuccess, setIsChargeSuccess] = useState(false);

  const modal = useSelector(selectModal);
  const darkMode = useDarkmode();

  const user = useSelector(selectUser);
  const detail = useSelector(selectInvoice);
  const tenantInfo: ITenant = user?.tenant ?? defaultTenant;

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: loadingActions } = useLoadingSlice();
  const { actions: invoiceAction } = useInvoiceInvoice();

  const navigator = useNavigate();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });

  const getData = async () => {
    dispatch(invoiceAction.getDetailRequest({ id: invoiceId }));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadPDFFile = async () => {
    dispatch(loadingActions.show());
    const url = `/invoices/${invoiceId}/export_pdf`;
    const apiArgs: IApiArguments = {
      params: {
        method: "get",
        responseType: "blob",
      },
      url,
    };
    const response = await request(apiArgs);
    exportToFile("pdf", response, `Invoice detail - ${detail.invoice_number}`);
    dispatch(loadingActions.close());
  };

  const handleChargeSuccess = value => {
    setIsChargeSuccess(value);
  };

  return (
    <DashboardLayout navbar={{ titleBreadcrumbs: detail.invoice_number }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Card>
            <MDBox ref={componentRef}>
              <InvoiceDetail invoice={detail} darkMode={darkMode} />
            </MDBox>
            {/* Invoice footer */}
            <MDBox p={3} mt={7}>
              <Grid container>
                <Grid item xs={12} lg={5}>
                  <MDTypography variant="h5" fontWeight="medium">
                    Thank you!
                  </MDTypography>
                  <MDBox mt={1} mb={2} lineHeight={0}>
                    <MDTypography variant="button" color={darkMode ? "text" : "secondary"}>
                      If you encounter any issues related to the invoice you can contact us at:
                    </MDTypography>
                  </MDBox>
                  <MDTypography
                    component="span"
                    variant="h6"
                    fontWeight="regular"
                    color={darkMode ? "text" : "secondary"}
                  >
                    email:{" "}
                    <MDTypography component="span" variant="h6" fontWeight="regular">
                      {tenantInfo.email ? tenantInfo.email : "No email information yet"}
                    </MDTypography>
                  </MDTypography>
                </Grid>
                <Grid item xs={12} lg={7}>
                  <MDBox
                    width="100%"
                    height={{ xs: "auto", md: "100%" }}
                    display="flex"
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    alignItems="flex-end"
                    flexWrap="wrap"
                    mt={{ xs: 2, md: 0 }}
                  >
                    {detail.status === "open" && (
                      <MDBox ml={2} sx={{ mt: { xs: 1, md: 0 } }}>
                        <MDButton
                          variant="gradient"
                          color="success"
                          onClick={() => {
                            !isChargeSuccess &&
                              dispatch(modalActions.open({ name: "pay-now-modal" }));
                          }}
                        >
                          {isChargeSuccess ? "Paid" : "Pay now"}
                        </MDButton>
                      </MDBox>
                    )}

                    {detail.status === "paid" && detail?.receipt && (
                      <MDBox ml={2} sx={{ mt: { xs: 1, md: 0 } }}>
                        <MDButton
                          variant="gradient"
                          color="success"
                          onClick={() => {
                            navigator(
                              `/receipt?invoiceId=${detail.id}&paymentId=${detail.receipt.id}`
                            );
                          }}
                        >
                          Receipt
                        </MDButton>
                      </MDBox>
                    )}
                    <MDBox ml={2} sx={{ mt: { xs: 1, md: 0 } }}>
                      <MDButton variant="outlined" color="info" onClick={handleDownloadPDFFile}>
                        Download
                      </MDButton>
                    </MDBox>
                    <MDBox ml={2} sx={{ mt: { xs: 1, md: 0 } }}>
                      <MDButton variant="gradient" color="info" onClick={handlePrint}>
                        print
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      {/* modal */}
      <MDModal isShow={modal.name === "pay-now-modal"}>
        <MDBox width={500}>
          <PaymentNow
            invoiceIds={[invoiceId]}
            customerId={detail.customer.id}
            handleChargeSuccess={handleChargeSuccess}
          />
        </MDBox>
      </MDModal>
    </DashboardLayout>
  );
}
