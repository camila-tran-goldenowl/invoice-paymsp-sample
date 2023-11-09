// libs
import { showLast4Digit } from "utils/card";
import { useDarkmode } from "hooks/useDarkmode";
import { useDispatch, useSelector } from "react-redux";

// core components
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import Tooltip from "@mui/material/Tooltip";

// components
import MDBox from "components/MDBox";
import CardLogo from "components/CardLogo";
import MDTypography from "components/MDTypography";

// store
import { useSlice as usePaymentMethodSlice } from "components/PaymentMethods/Customer/slice";
import { selectPaymentMethodDefault } from "components/PaymentMethods/Customer/slice/selectors";

// string
import { IPaymentResponse } from "types/PaymentCard";
import colors from "assets/theme/base/colors";
import LabelStatus from "components/LabelStatus";

interface IPaymentCardProps {
  card: IPaymentResponse;
  customerId: string;
}

const PaymentCard = ({ card, customerId }: IPaymentCardProps) => {
  const darkMode = useDarkmode();

  const dispatch = useDispatch();
  const { actions: paymentMethodActions } = usePaymentMethodSlice();
  const defaultCard = useSelector(selectPaymentMethodDefault);

  const handleUpdateDefaultCard = async id => {
    dispatch(
      paymentMethodActions.updateCardRequest({
        id,
        customerId,
        data: {
          default: true,
        },
        actionMessage: "Update default card",
      })
    );
  };

  const handleDeleteCard = async id => {
    dispatch(
      paymentMethodActions.deleteCardRequest({
        id,
        customerId,
      })
    );
  };

  const isVerifyFinish = Boolean(card.hosted_verification_url);

  return (
    <MDBox
      borderRadius="lg"
      py={2}
      px={3}
      sx={{
        position: "relative",
        border: ({ borders: { borderWidth, borderColor } }) =>
          `${borderWidth[1]} solid ${borderColor}`,
      }}
    >
      <MDBox top={10} left={24} sx={{ position: "absolute", display: "flex" }}>
        {card.id === defaultCard?.id && <LabelStatus color={colors.success.main} text="Default" />}
        {isVerifyFinish && (
          <Tooltip title={"Click to complete verify"} placement="top">
            <MDBox
              onClick={() => {
                isVerifyFinish && window.open(card.hosted_verification_url, "_blank");
              }}
            >
              <LabelStatus color={colors.warning.main} text="Pending" />
            </MDBox>
          </Tooltip>
        )}
      </MDBox>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" my={2} ml="-9px">
        <Radio
          onChange={e => handleUpdateDefaultCard(e.target.value)}
          value={card.id}
          checked={card.id === defaultCard?.id}
        />
        <CardLogo type={card.card_type ? card.card_type : card.type} />
        <MDTypography variant="h6" fontWeight="medium">
          {showLast4Digit(card.last_4digits)}
        </MDTypography>
        <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
          <Tooltip title="Delete Card" placement="top">
            <Icon
              sx={{ cursor: "pointer" }}
              fontSize="small"
              onClick={() => handleDeleteCard(card.id)}
            >
              delete
            </Icon>
          </Tooltip>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

export default PaymentCard;
