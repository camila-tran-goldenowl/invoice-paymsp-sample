// libs
import { useDispatch, useSelector } from "react-redux";

// store
import { selectGatewayType } from "components/Tenant/slice/selectors";
import { useToastifySlice, IToastType } from "components/Toastify/slice";
import { selectIsOnBoarding } from "pages/Settings/PaymentGateway/slice/selectors";

// data
import { GATEWAY } from "utils/constants";

const useGatewayCheck = () => {
  const dispatch = useDispatch();
  const { actions: toastAction } = useToastifySlice();

  const gatewayType = useSelector(selectGatewayType);
  const isOnBoarding = useSelector(selectIsOnBoarding);

  const check = ({ action }: { action: () => void }) => {
    if (!gatewayType) {
      return dispatch(
        toastAction.notify({
          type: IToastType.WARNING,
          title: "Failed",
          content: "Please complete your Payment Gateway process first",
        })
      );
    }
    if (gatewayType === GATEWAY.stripe && !isOnBoarding) {
      return dispatch(
        toastAction.notify({
          type: IToastType.WARNING,
          title: "Failed",
          content: "Please complete your Payment Gateway onboarding process first",
        })
      );
    }
    action();
  };

  return {
    check,
  };
};

export default useGatewayCheck;
