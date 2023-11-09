/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// components
import MDBox from "components/MDBox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import MDTypography from "components/MDTypography";
import FormControlLabel from "@mui/material/FormControlLabel";

// data
import { paymentTypeList as typeList } from "./data";
import { PAYMENT_TYPE } from "utils/constants";
import { isClientRole } from "utils/roles";

// saga
import { selectDisableCredit } from "components/Tenant/slice/selectors";
import { selectDisableCredit as selectDisableCreditCustomer } from "pages/Customer/slice/selectors";

const PaymentTypeOption = ({ type, setValue, handleChangePaymentType, isCustomer }) => {
  const isDisableTenant = useSelector(selectDisableCredit);
  const isDisableCustomer = useSelector(selectDisableCreditCustomer);

  let isDisableCreditCard = isClientRole() || isCustomer ? isDisableCustomer : isDisableTenant;

  const [paymentType, setPaymentType] = useState(
    !isDisableCreditCard ? PAYMENT_TYPE.card : PAYMENT_TYPE.bank
  );
  const [paymentTypeList, setPaymentTypeList] = useState(typeList);
  useEffect(() => {
    if (isDisableCreditCard) {
      const filterList = paymentTypeList.filter(item => item.value !== PAYMENT_TYPE.card);
      setPaymentTypeList(filterList);
    }
  }, [isDisableCreditCard]);

  useEffect(() => {
    handleChangePaymentType(paymentType);
  }, [paymentType]);

  return (
    <MDBox>
      <MDTypography
        variant="button"
        fontWeight="regular"
        display="block"
        sx={{ textAlign: "left" }}
      >
        Payment Type
      </MDTypography>
      <RadioGroup
        row
        name={type.name}
        value={paymentType}
        onChange={e => {
          const value = e.target.value;
          setPaymentType(value);
          setValue(type.name, value);
        }}
      >
        {paymentTypeList.map(item => {
          return <FormControlLabel value={item.value} control={<Radio />} label={item.text} />;
        })}
      </RadioGroup>
    </MDBox>
  );
};

export default PaymentTypeOption;
