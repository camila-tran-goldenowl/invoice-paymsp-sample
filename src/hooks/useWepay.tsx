// lib
import WePay from "utils/wepay";
import { useState } from "react";
import { useDispatch } from "react-redux";

// store
import { loadingActions } from "components/MDLoading/slice";
import { toastActions, IToastType } from "components/Toastify/slice";

// data
import { ENV } from "utils/constants";
import { WEPAY_OPTIONS } from "pages/Customer/components/Form/CardForm/styles";

const useWepay = () => {
  const [isACH, setIsACH] = useState(false);
  const [cardElm, setCardElm] = useState(null);

  const dispatch = useDispatch();

  const openPlaid = ({ actionSuccess }) => {
    const paymentBankLightBox = WePay.createPaymentBankLightBox(
      data => {
        if (paymentBankLightBox.error_code) {
          dispatch(
            toastActions.notify({
              type: IToastType.ERROR,
              title: `Connect to Wepay failed`,
              content: paymentBankLightBox.error_code,
            })
          );
        }
      },
      { avoid_micro_deposits: true }
    );

    paymentBankLightBox
      .tokenize()
      .then(function (response) {
        const tokenId = response.id;
        actionSuccess?.(tokenId);
        setIsACH(true);
      })
      .catch(err => {
        dispatch(
          toastActions.notify({
            type: IToastType.ERROR,
            title: ` Bank account connect failed`,
            content: err.error_message,
          })
        );
      });
  };

  const connectWepay = () => {
    dispatch(loadingActions.show());
    var error = WePay.configure(ENV.WEPAY_ENV, ENV.WEPAY_APP_ID, ENV.WEPAY_VERSION);
    if (error) {
      dispatch(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Connect to Wepay failed`,
          content: error.error_message,
        })
      );
    }
    dispatch(loadingActions.close());
  };

  const initCardElement = ({ elementId }) => {
    const iframe_container_id = elementId;
    const creditCard = WePay.createCreditCardIframe(iframe_container_id, WEPAY_OPTIONS);
    setCardElm(creditCard);
  };

  const createCreditCard = ({ actionSuccess }) => {
    cardElm
      .tokenize()
      .then(function (response) {
        const tokenId = response.id;
        actionSuccess?.(tokenId);
      })
      .catch(function (error) {
        dispatch(
          toastActions.notify({
            type: IToastType.ERROR,
            title: `Failed to add payment method`,
            content: error.error_message,
          })
        );
      });
  };

  return { openPlaid, connectWepay, initCardElement, createCreditCard, isACH };
};

export default useWepay;
