// libs
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";

// components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// styles
import pxToRem from "assets/theme/functions/pxToRem";

// store
import { useModalSlice } from "components/MDModal/slice";
import { useSlice as useInvoicesSlice } from "../../slice";
import MDForm from "components/MDForm";

interface IInvoiceEmailFormProps {
  invoiceId: string;
  billingAddress?: string;
  successAction?: () => void;
}

interface IInvoiceEmailForm {
  emails: string;
}
const InvoiceEmailForm = ({
  invoiceId,
  billingAddress = "",
  successAction = null,
}: IInvoiceEmailFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IInvoiceEmailForm>({
    defaultValues: {
      emails: billingAddress.toLowerCase(),
    },
  });

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: invoicesActions } = useInvoicesSlice();

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSubmit: SubmitHandler<IInvoiceEmailForm> = async data => {
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
      invoicesActions.sendPaynowInvoiceRequest({
        invoiceList: [invoiceId],
        emailList,
        actionSuccess: () => {
          successAction?.();
          dispatch(modalActions.close({}));
        },
      })
    );
  };

  return (
    <MDForm title="Sending Invoice">
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBox mb={2} sx={{ textAlign: "left" }}>
          <MDInput
            type="text"
            label="Email"
            variant="standard"
            fullWidth
            placeholder="john@example.com"
            InputLabelProps={{ shrink: true }}
            {...register("emails", { required: "Email is required" })}
          />
          <MDTypography variant="caption" fontWeight="regular" color="text">
            Enter emails (comma separated)
          </MDTypography>
          <MDBox width={pxToRem(400)}>
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

export default InvoiceEmailForm;
