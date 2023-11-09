/* eslint-disable react-hooks/exhaustive-deps */
// libs
import * as Cryptor from "utils/cryptor";
import useRecapcha from "hooks/useRecapcha";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";

// core components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import AuthLayout from "components/LayoutContainer/AuthLayout";

// store
import { useSlice } from "./slice";
import { SignInForm } from "./slice/types";
import { isAdminPage } from "utils/helperFunc";
import { selectError, selectNoLoginFail } from "./slice/selectors";
import { selectCompanyName } from "components/Tenant/slice/selectors";
import { useToastifySlice, IToastType } from "components/Toastify/slice";

// data
import { ENV } from "utils/constants";

const FAIL_TIMES = 3;

export function SignInPage(): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();

  const { actions } = useSlice();
  const { actions: toastifyActions } = useToastifySlice();
  const recaptchaRef = useRef(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const error = useSelector(selectError);
  const companyName = useSelector(selectCompanyName);
  const noLoginFail = useSelector(selectNoLoginFail);
  const errorFactor = ["OTP is required", "The 2FA OTP incorrect"].includes(error);
  const { verifyToken } = useRecapcha();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignInForm>();

  const onSubmit: SubmitHandler<SignInForm> = async data => {
    if (Number(noLoginFail) >= FAIL_TIMES) {
      const token = recaptchaRef.current.getValue();
      if (!token) {
        setError("capcha", { type: "custom", message: "Please check the the captcha form." });
        return;
      } else {
        clearErrors("capcha");
        verifyToken({ token, successAction: () => {} });
      }
    }
    data.password = await Cryptor.encrypt(data.password);
    dispatch(actions.signInRequest(data));
  };

  useEffect(() => {
    recaptchaRef?.current?.reset();
  }, [error, errors]);

  useEffect(() => {
    dispatch(actions.reset());
    if (location?.state) {
      dispatch(
        toastifyActions.notify({
          type: IToastType.WARNING,
          title: "Sign in",
          content:
            "A message with a confirmation link has been sent to your email address. Please open the link to activate your account.",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MDBox>
      <AuthLayout>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign in
            </MDTypography>

            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to Sign In
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <MDBox component="form" role="form"> */}
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  placeholder="john@example.com"
                  InputLabelProps={{ shrink: true }}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email?.message && (
                  <MDTypography variant="button" fontWeight="regular" color="error">
                    {errors.email.message}
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  placeholder="************"
                  InputLabelProps={{ shrink: true }}
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password?.message && (
                  <MDTypography variant="button" fontWeight="regular" color="error">
                    {errors.password.message}
                  </MDTypography>
                )}
              </MDBox>
              {!companyName && (
                <MDBox mb={2}>
                  <MDInput
                    type="subdomain"
                    label="Company name"
                    variant="standard"
                    fullWidth
                    {...register("subdomain", { required: "Subdomain is required" })}
                  />
                  {errors.subdomain?.message && (
                    <MDTypography variant="button" fontWeight="regular" color="error">
                      {errors.subdomain.message}
                    </MDTypography>
                  )}
                </MDBox>
              )}

              {errorFactor && (
                <MDBox mb={2}>
                  <MDInput
                    type="number"
                    label="OTP"
                    variant="standard"
                    fullWidth
                    placeholder="************"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
                    {...register("otp", { required: "OTP is required" })}
                  />
                  {errors.otp?.message && (
                    <MDTypography variant="button" fontWeight="regular" color="error">
                      {errors.otp.message}
                    </MDTypography>
                  )}
                </MDBox>
              )}

              {Number(noLoginFail) >= FAIL_TIMES && (
                <MDBox mb={2}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={ENV.RECAPCHA_SITE_KEY}
                    onChange={() => {
                      if (errors.capcha) {
                        clearErrors("capcha");
                      }
                    }}
                  />
                  {errors.capcha?.message && (
                    <MDTypography variant="button" fontWeight="regular" color="error">
                      {errors.capcha.message}
                    </MDTypography>
                  )}
                </MDBox>
              )}

              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={() => setRememberMe(!rememberMe)}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  sign in
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDBox display="flex" justifyContent="space-around">
                  <MDBox>
                    <MDTypography
                      component={Link}
                      to="/users/request-access"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Request Access
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <MDTypography
                      component={Link}
                      to="/users/password/email"
                      variant="button"
                      color="error"
                      fontWeight="medium"
                      textGradient
                    >
                      Reset Password
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {isAdminPage && (
                  <MDTypography variant="button" color="text">
                    Don&apos;t have an account?{" "}
                    <MDTypography
                      component={Link}
                      to="/sign-up"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Sign up
                    </MDTypography>
                  </MDTypography>
                )}
              </MDBox>
              {/* </MDBox> */}
            </form>
          </MDBox>
        </Card>
      </AuthLayout>
    </MDBox>
  );
}
