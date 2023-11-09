// libs
import { ReactNode } from "react";
import { useDarkmode } from "hooks/useDarkmode";
import { useDispatch, useSelector } from "react-redux";

// core components
import MDBox from "components/MDBox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// store
import { useModalSlice } from "components/MDModal/slice";
import { selectThemeSetting } from "components/Tenant/slice/selectors";

// style
import colors from "assets/theme-dark/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";

interface IModalProps {
  isShow: boolean;

  children: ReactNode;
}

const MDModal = ({ isShow, children }: IModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { miniSidenav } = useSelector(selectThemeSetting);

  const darkMode = useDarkmode();
  const styleDarkContainer = {
    backgroundColor: colors.background.default,
  };

  const handleClose = () => {
    dispatch(modalActions.close({}));
  };

  const modalContainerStyles = {
    width: {
      md: `calc(100vw - ${
        miniSidenav === null ? "0px" : Boolean(miniSidenav) ? pxToRem(120) : pxToRem(274)
      })`,
    },
    left: { md: "auto" },
  };

  return (
    <Dialog
      onClose={handleClose}
      open={isShow}
      sx={{
        borderRadius: 4,
        ...modalContainerStyles,
        "& .MuiBackdrop-root": modalContainerStyles,
      }}
      maxWidth={false}
    >
      <DialogContent sx={darkMode ? styleDarkContainer : {}}>
        <MDBox
          variant="gradient"
          borderRadius="lg"
          mb={1}
          textAlign="center"
          sx={darkMode ? styleDarkContainer : {}}
        >
          {children}
        </MDBox>
      </DialogContent>
    </Dialog>
  );
};

export default MDModal;
