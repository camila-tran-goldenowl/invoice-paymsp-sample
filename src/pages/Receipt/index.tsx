/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useQuery } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { useDarkmode } from "hooks/useDarkmode";
import { useDispatch, useSelector } from "react-redux";

// core components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// components
import MDBox from "components/MDBox";
import MDModal from "components/MDModal";
import MDButton from "components/MDButton";
import RecieptDetail from "./components/RecieptDetail";
import DashboardLayout from "components/LayoutContainer/DashboardLayout";
import RecieptEmailForm from "pages/AllInvoices/components/RecieptEmailForm";

// store
import { useModalSlice } from "components/MDModal/slice";
import { selectDetail } from "pages/Payments/slice/selectors";
import { selectTenant } from "components/Tenant/slice/selectors";
import { selectModal } from "components/MDModal/slice/selectors";
import { useSlice as useInvoiceSlice } from "pages/Invoice/slice";
import { useSlice as usePaymentSlice } from "pages/Payments/slice";

// utils
import { isTenantAccount } from "utils/roles";

export function RecieptPage(): JSX.Element {
  const query = useQuery();
  const paymentId = query.get("paymentId") ?? "";

  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const tenant = useSelector(selectTenant);
  const receiptDetail = useSelector(selectDetail);
  const darkMode = useDarkmode();
  const invoiceId = receiptDetail?.invoice?.id;

  const { actions: modalActions } = useModalSlice();
  const { actions: invoiceActions } = useInvoiceSlice();
  const { actions: paymentActions } = usePaymentSlice();

  const [isShowRefund, setIsShowRefund] = useState(true);

  useEffect(() => {
    dispatch(paymentActions.detailRequest({ id: paymentId }));
  }, [paymentId]);

  return (
    <DashboardLayout
      navbar={{ titleBreadcrumbs: `receipt / ${receiptDetail?.invoice?.invoice_number}` }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Card>
            <MDBox>
              <RecieptDetail receipt={receiptDetail} darkMode={darkMode} tenant={tenant} />
            </MDBox>
            <MDBox p={3} mt={7} sx={{ float: "right", width: "100%", display: "flex" }}>
              {isTenantAccount() && isShowRefund && (
                <MDBox mr={2}>
                  <MDButton
                    variant="gradient"
                    color="success"
                    onClick={() => {
                      dispatch(
                        invoiceActions.refundRequest({
                          invoiceId,
                          actionSuccess: () => {
                            dispatch(invoiceActions.getDetailRequest({ id: invoiceId }));
                            setIsShowRefund(false);
                          },
                        })
                      );
                    }}
                  >
                    Refund
                  </MDButton>
                </MDBox>
              )}

              <MDButton
                variant="gradient"
                color="info"
                onClick={() => {
                  dispatch(
                    modalActions.open({
                      name: "reciept-email-modal",
                      data: { invoiceId: invoiceId },
                    })
                  );
                }}
              >
                Send
              </MDButton>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <MDModal isShow={modal.name === "reciept-email-modal"}>
        <RecieptEmailForm invoiceId={modal?.data?.invoiceId} />
      </MDModal>
    </DashboardLayout>
  );
}
