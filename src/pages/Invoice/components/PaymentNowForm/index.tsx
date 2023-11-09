// libs
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import usePaymentFee from "hooks/usePaymentFee";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

// core components
import Grid from "@mui/material/Grid";

// components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import CardLogo from "components/CardLogo";
import MDTypography from "components/MDTypography";
import { RHFAutocompleteArrayObject as MDSelect } from "components/ReactHookForm";

// saga
import { useModalSlice } from "components/MDModal/slice";
import { useSlice as useInvoiceSlice } from "../../slice";
import { useSlice as useInvoicesSlice } from "pages/AllInvoices/slice";
import { useSlice as useCustomerSlice } from "components/PaymentMethods/Customer/slice";
import { selectPaymentMethodList } from "components/PaymentMethods/Customer/slice/selectors";

// data
import { PAYMENT_TYPE, PRIORITY_FEE } from "utils/constants";

interface IPaymentNowProps {
  customerId: string;
  invoiceIds: Array<string>;
  handleChargeSuccess?: (value) => void;
}

const validationSchema = Yup.object().shape({
  card_id: Yup.object({
    value: Yup.string().required("Payment methods is required."),
  }),
});

const PaymentNow = ({
  customerId,
  invoiceIds,
  handleChargeSuccess,
}: IPaymentNowProps): JSX.Element => {
  const [cardList, setCardList] = useState([]);

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: invoiceActions } = useInvoiceSlice();
  const { actions: customerActions } = useCustomerSlice();
  const { actions: invoicesActions } = useInvoicesSlice();

  const paymentList = useSelector(selectPaymentMethodList);
  const { convenienceFee, achDiscount } = usePaymentFee({ type: PRIORITY_FEE.customer });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const cardSelected = watch("card_id", null);
  const isCreditCardSelected = cardSelected?.type === PAYMENT_TYPE.card;

  const getCard = async () => {
    dispatch(customerActions.detailFetchRequest({ customerId }));
  };

  useEffect(() => {
    const listMap = paymentList.map(item => {
      const { id, last_4digits, card_type, type } = item;
      return { value: id, text: last_4digits, card_type, type };
    });
    setCardList(listMap);
  }, [paymentList]);

  const onSubmit = async data => {
    dispatch(
      invoiceActions.chargeRequest({
        invoiceIds,
        cardId: data.card_id.value,
        actionSuccess: () => {
          handleChargeSuccess?.(true);
          dispatch(invoiceActions.getDetailRequest({ id: invoiceIds }));
          dispatch(
            invoicesActions.getDetailRequest({
              page: 1,
              pageSize: 5,
              customerId,
            })
          );
          dispatch(modalActions.close({}));
        },
      })
    );
  };

  useEffect(() => {
    customerId && getCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const renderOptions = (props, option) => {
    return (
      <li>
        <MDBox display="flex" alignItems="center" my={1} {...props}>
          <CardLogo type={option.card_type ? option.card_type : option.type} />
          <MDTypography variant="button">{option.text}</MDTypography>
        </MDBox>
      </li>
    );
  };

  return (
    <MDBox>
      {cardSelected?.value && (
        <MDBox sx={{ textAlign: "left" }}>
          {isCreditCardSelected && convenienceFee && (
            <MDTypography variant="button" color="text" fontWeight="bold">
              *Credit Card payment is subject to {convenienceFee}% convenience fee
            </MDTypography>
          )}
          {!isCreditCardSelected && achDiscount !== 0 && achDiscount !== null && (
            <MDTypography variant="button" color="text" fontWeight="bold">
              {`${Math.abs(achDiscount)}% ACH ${
                achDiscount > 0 ? ` fee` : ` discount `
              }  will be applied`}
            </MDTypography>
          )}
        </MDBox>
      )}
      <MDBox mt={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDSelect
                control={control}
                name="card_id"
                label="Payment method"
                items={cardList}
                errors={errors}
                renderOption={(props, option) => renderOptions(props, option)}
                getOptionLabel={option => option.text ?? ""}
              />
            </Grid>
          </Grid>
          <MDBox mt={2} width="100%" display="flex" justifyContent="center">
            <MDButton type="submit" variant="outlined" color="info">
              Charge
            </MDButton>
            <MDButton
              variant="outlined"
              color="error"
              sx={{ ml: 2 }}
              onClick={() => {
                dispatch(modalActions.close({}));
              }}
            >
              Close
            </MDButton>
          </MDBox>
        </form>
      </MDBox>
    </MDBox>
  );
};
export default PaymentNow;
