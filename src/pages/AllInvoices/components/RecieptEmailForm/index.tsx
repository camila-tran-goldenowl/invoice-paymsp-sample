// libs
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";

// components
import MDBox from "components/MDBox";
import MDForm from "components/MDForm";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// store
import { useModalSlice } from "components/MDModal/slice";
import { useSlice as usePaymentSlice } from "pages/Payments/slice";

interface IRecieptEmailFormProps {
  invoiceId: string;
  billingAddress?: any;
  successAction?: () => void;
  subdomain?: string;
}

interface IRecieptEmailForm {
  emails: string;
}
const RecieptEmailForm = ({
  invoiceId,
  billingAddress = "",
  subdomain,
  successAction = null,
}: IRecieptEmailFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IRecieptEmailForm>({
    defaultValues: {
      emails: billingAddress.toLowerCase(),
    },
  });

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: paymentActions } = usePaymentSlice();

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSubmit: SubmitHandler<IRecieptEmailForm> = async data => {
    const { emails: emailString } = data;
    const emailList = emailString.split(",");
    const emailErrorList = emailList.filter(item => !validateEmail(item.trim()));
    if (emailErrorList.length) {
      return setError("emails", {
        type: "custom",
        message: `${emailErrorList.join(", ")}  not an email`,
      });
    }

    dispatch(
      paymentActions.sendPDFRecieptRequest({
        invoiceList: [invoiceId],
        emailList,
        subdomain,
        actionSuccess: () => {
          successAction?.();
          dispatch(modalActions.close({}));
        },
      })
    );
  };

  return (
    <MDForm title="Sending Receipt" width={{ md: "30vw" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBox mb={2} sx={{ textAlign: "left" }}>
          <MDInput
            type="text"
            label="Emails"
            variant="standard"
            fullWidth
            placeholder="john@example.com"
            InputLabelProps={{ shrink: true }}
            {...register("emails", {
              required: "Enter emails (comma separated)",
            })}
          />
          <MDTypography variant="caption" fontWeight="regular" color="text">
            Enter emails (comma separated)
          </MDTypography>
          <MDBox>
            {errors.emails?.message && (
              <MDTypography variant="button" fontWeight="regular" color="error">
                {errors.emails.message}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton variant="gradient" color="info" fullWidth type="submit">
            Submit
          </MDButton>
        </MDBox>
      </form>
    </MDForm>
  );
};

export default RecieptEmailForm;
