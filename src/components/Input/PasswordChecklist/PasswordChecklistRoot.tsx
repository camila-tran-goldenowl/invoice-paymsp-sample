import Box from "@mui/material/Box";
import { styled, Theme } from "@mui/material/styles";
import pxToRem from "assets/theme/functions/pxToRem";

export default styled(Box)(({ theme, ownerState }: { theme?: Theme; ownerState: any }) => {
  const { typography, palette } = theme;
  const { darkMode } = ownerState;
  const { size } = typography;
  const { dark, white } = palette;

  return {
    color: darkMode ? white.main : dark.main,
    li: {
      display: "flex",
      alignItems: "center",
    },
    span: {
      marginLeft: "2px",
      fontSize: size.sm,
    },
    svg: {
      with: pxToRem(14),
      height: pxToRem(14),
    },
  };
});
