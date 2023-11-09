/* eslint-disable react-hooks/exhaustive-deps */
// lib
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// store
import { loadingActions } from "components/MDLoading/slice";
import { selectTenant } from "components/Tenant/slice/selectors";
import { toastActions, IToastType } from "components/Toastify/slice";
import { selectCompanyName } from "components/Tenant/slice/selectors";
import { useSlice as usePaymentGatewaySlice } from "pages/Settings/PaymentGateway/slice";
import { useSlice as useTenantPaymentSlice } from "components/PaymentMethods/Tenant/slice";
import { selectClientSecret as selectCustomerClientSecret } from "pages/Settings/PaymentGateway/slice/selectors";
import { selectClientSecret as selectTenantClientSecret } from "components/PaymentMethods/Tenant/slice/selectors";

// data
import { ENV, GATEWAY } from "utils/constants";

interface IStripeProps {
  appendToElementId: string;
  defaultStripeAccount?: string;
  gateway: string;
  type: "customer" | "tenant";
  customerId?: string;
}

let stripe = null;
let elements = null;

const useStripe = ({
  appendToElementId,
  defaultStripeAccount,
  gateway,
  type = "customer",
  customerId,
}: IStripeProps) => {
  const [paymentType, setPaymentType] = useState(null);

  const dispatch = useDispatch();
  const { actions: paymentGatewayActions } = usePaymentGatewaySlice();
  const { actions: tenantPaymentActions } = useTenantPaymentSlice();

  const isCustomer = type === "customer";

  const tenant = useSelector(selectTenant);
  const companyName = useSelector(selectCompanyName);
  const stripeAccount = tenant?.stripe_account_id ?? defaultStripeAccount;

  const tenantClientSecret = useSelector(selectTenantClientSecret);
  const customerClientSecret = useSelector(selectCustomerClientSecret);
  const clientSecret = isCustomer ? customerClientSecret : tenantClientSecret;

  useEffect(() => {
    if (!isCustomer) {
      dispatch(tenantPaymentActions.detailSetupIntentRequest());
    }
    if (gateway === GATEWAY.stripe) {
      dispatch(
        paymentGatewayActions.detailSetupIntentRequest({ subdomain: companyName, customerId })
      );
    }
  }, [gateway, companyName]);

  useEffect(() => {
    if (clientSecret && window["Stripe"]) {
      dispatch(loadingActions.show());
      const stripeAccountObj = isCustomer
        ? {
            stripeAccount: stripeAccount,
          }
        : {};
      stripe = window["Stripe"](ENV.STRIPE_PUBLIC_KEY, stripeAccountObj);
      const options = {
        clientSecret: clientSecret,
        appearance: {},
      };
      elements = stripe.elements(options);
      const paymentElement = elements.create("payment");
      const element = document.getElementById(appendToElementId);
      if (!element) return;
      paymentElement.mount(`#${appendToElementId}`);

      paymentElement.on("change", function (event) {
        setPaymentType(event.value.type);
      });
      dispatch(loadingActions.close());
    }
  }, [clientSecret, stripeAccount, window["Stripe"]]);

  const createCard = async ({ actionSuccess }) => {
    const { error: submitError } = await elements.submit();

    if (submitError) {
      return dispatch(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Failed to add payment method`,
          content: submitError.message,
        })
      );
    }

    stripe
      .confirmSetup({
        elements,
        confirmParams: {
          return_url: "https://example.com",
        },
        redirect: "if_required",
      })
      .then(({ setupIntent, error }) => {
        if (error) {
          dispatch(loadingActions.close());
          dispatch(
            toastActions.notify({
              type: IToastType.ERROR,
              title: `Failed to add payment method`,
              content: error.message,
            })
          );
          return Promise.resolve({ isVerifyACHMannual: false });
        } else {
          const { payment_method: tokenId } = setupIntent;
          actionSuccess?.(tokenId);
          dispatch(loadingActions.close());
        }
      });
  };

  return { createCard, paymentType };
};

export default useStripe;
