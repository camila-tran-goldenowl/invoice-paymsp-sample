import { useDispatch } from "react-redux";
import { IToastType } from "components/Toastify/slice";
import { useToastifySlice } from "components/Toastify/slice";
import { useSlice as useSignInSlice } from "pages/SignInPage/slice";

const useRecapcha = () => {
  const dispatch = useDispatch();
  const { actions: toastAction } = useToastifySlice();
  const { actions: signInActions } = useSignInSlice();
  const verifyToken = ({ token, successAction = () => {}, failAction = () => {} }) => {
    try {
      dispatch(signInActions.verifyCapchaRequest({ token, successAction, failAction }));
    } catch (err: any) {
      dispatch(
        toastAction.notify({
          type: IToastType.ERROR,
          title: "Recapcha verify failed",
        })
      );
      throw new Error("Recapcha verify failed");
    }
  };
  return { verifyToken };
};

export default useRecapcha;
