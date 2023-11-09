// libs
import { useSelector } from "react-redux";

// components
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// redux
import { selectIsShow } from "./slice/selectors";

interface ILoadingProps {
  isShow?: Boolean;
}

const MDLoading = ({ isShow = false }: ILoadingProps) => {
  const isLoading = useSelector(selectIsShow);

  return (
    <Backdrop
      sx={{
        backgroundColor: "rgba(0,0,0,0.3)",
        opacity: 0.5,
        zIndex: 999999999,
      }}
      open={Boolean(isShow) || isLoading}
    >
      <CircularProgress
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 100,
          color: "#1A73E8",
        }}
      />
    </Backdrop>
  );
};

MDLoading.defaultProps = {
  isShow: false,
};
export default MDLoading;
