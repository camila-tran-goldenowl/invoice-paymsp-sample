// core components
import { Theme } from "@mui/material/styles";

function item(theme: Theme | any, ownerState: any) {
  const { palette, borders, functions, transitions } = theme;
  const { active, color, transparentSidenav, whiteSidenav, darkMode, isChild } = ownerState;

  const { transparent, white, grey } = palette;
  const { borderRadius } = borders;
  const { rgba, pxToRem } = functions;

  return {
    mt: 0.375,
    mb: 0.3,
    width: "100%",
    padding: isChild ? `${pxToRem(8)} ${pxToRem(16)}` : 0,
    paddingLeft: isChild ? "24px" : 0,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    backgroundColor: () => {
      let backgroundValue = transparent.main;

      if (
        (active === "isParent" && !transparentSidenav && !whiteSidenav) ||
        (active === "isParent" && transparentSidenav && darkMode)
      ) {
        backgroundValue = rgba(white.main, 0.2);
      } else if (active === "isParent" && transparentSidenav) {
        backgroundValue = grey[300];
      } else if (active === "isParent" && whiteSidenav) {
        backgroundValue = grey[200];
      } else if (active) {
        backgroundValue = palette[color].main;
      }

      return backgroundValue;
    },
    transition: transitions.create("background-color", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.shorter,
    }),

    "&:hover, &:focus": {
      backgroundColor:
        !active &&
        rgba((transparentSidenav && !darkMode) || whiteSidenav ? grey[400] : white.main, 0.2),
    },
  };
}

function itemContent(theme: Theme, ownerState: any) {
  const { palette, typography, transitions, functions } = theme;
  const { name, active, transparentSidenav, whiteSidenav, darkMode, isChild } = ownerState;

  const { white, dark } = palette;
  const { size, fontWeightRegular, fontWeightLight } = typography;
  const { pxToRem } = functions;

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: `${pxToRem(8)} ${pxToRem(16)}`,
    marginLeft: !isChild ? 0 : pxToRem(18),
    userSelect: "none",
    position: "relative",

    minHeight: pxToRem(32),

    "& span": {
      color:
        ((transparentSidenav && !darkMode) || whiteSidenav) && (active === "isParent" || !active)
          ? dark.main
          : white.main,
      fontWeight: active ? fontWeightRegular : fontWeightLight,
      // opacity: miniSidenav ? 0 : 1,
      transition: transitions.create(["opacity", "color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
      minWidth: pxToRem(32),
    },

    "&::before": {
      content: isChild ? `"${name[0]}"` : '""',
      color:
        ((transparentSidenav && !darkMode) || whiteSidenav) && (active === "isParent" || !active)
          ? dark.main
          : white.main,
      fontWeight: fontWeightRegular,
      display: "flex",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: pxToRem(-15),
      opacity: 1,
      borderRadius: "50%",
      fontSize: size.sm,
    },
  };
}

function itemText(theme: any, ownerState: any) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightRegular, fontWeightLight } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),
    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightRegular : fontWeightLight,
      fontSize: size.sm,
      lineHeight: 0,
    },
  };
}

function itemArrow(theme: Theme, ownerState: any) {
  const { palette, typography, transitions, breakpoints, functions } = theme;
  const { noCollapse, transparentSidenav, whiteSidenav, miniSidenav, open, active, darkMode } =
    ownerState;

  const { white, dark } = palette;
  const { size } = typography;
  const { pxToRem, rgba } = functions;

  return {
    fontSize: `${size.lg} !important`,
    fontWeight: 700,
    marginBottom: pxToRem(-1),
    transform: open ? "rotate(0)" : "rotate(-180deg)",
    color: () => {
      let colorValue;

      if (transparentSidenav && darkMode) {
        colorValue = open || active ? white.main : rgba(white.main, 0.25);
      } else if (transparentSidenav || whiteSidenav) {
        colorValue = open || active ? dark.main : rgba(dark.main, 0.25);
      } else {
        colorValue = open || active ? white.main : rgba(white.main, 0.5);
      }

      return colorValue;
    },
    transition: transitions.create(["color", "transform", "opacity"], {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      display:
        noCollapse || (transparentSidenav && miniSidenav) || miniSidenav
          ? "none !important"
          : "block !important",
    },
  };
}

export { item, itemContent, itemArrow, itemText };
