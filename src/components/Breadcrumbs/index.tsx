// libs
import React from "react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

// core components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface IRoute {
  label: string;
  to: string;
}

// Declaring props types for the Breadcrumbs
interface Props {
  icon: ReactNode;
  title: string;
  route: Array<IRoute>;
  light?: boolean;
  [key: string]: any;
}

function Breadcrumbs({ icon, title, route, light }: Props): JSX.Element {
  const routes = route.slice(0, -1);

  const removeCharacter = string => {
    return string.replace(/[._-]/g, " ");
  };

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map(el => (
          <Link to={`/${el.to}`} key={el.to}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {removeCharacter(el.label)}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {removeCharacter(title)}
        </MDTypography>
      </MuiBreadcrumbs>
      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {removeCharacter(title)}
      </MDTypography>
    </MDBox>
  );
}

// Declaring default props for Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

export default Breadcrumbs;
