// libs
import { useSelector } from "react-redux";

// store
import {
  selectACHDiscount,
  selectDisableCredit,
  selectFeePercent,
} from "components/Tenant/slice/selectors";
import { selectCustomer } from "pages/Customer/slice/selectors";

// data
import { PRIORITY_FEE } from "utils/constants";
import { defaultCustomer } from "pages/Customer/slice/types";

interface IPaymentFee {
  type: string;
}

const usePaymentFee = ({ type }: IPaymentFee) => {
  const globalACHDiscount = useSelector(selectACHDiscount);
  const globalConvenienceFee = useSelector(selectFeePercent);
  const globalDisableCreditCard = useSelector(selectDisableCredit);

  const customer = useSelector(selectCustomer) ?? defaultCustomer;

  const isCustomer = type === PRIORITY_FEE.customer;

  return {
    convenienceFee:
      isCustomer && customer.convenience_fee_percent !== null
        ? customer?.convenience_fee_percent
        : globalConvenienceFee,
    achDiscount:
      isCustomer && customer.bank_discount_percent !== null
        ? customer?.bank_discount_percent
        : globalACHDiscount,
    disableCreditCard:
      isCustomer && customer.disable_credit_card !== null
        ? customer?.disable_credit_card
        : globalDisableCreditCard,
  };
};

export default usePaymentFee;
