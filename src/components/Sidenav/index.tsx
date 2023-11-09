/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, ReactNode } from "react";
import { useLocation, NavLink } from "react-router-dom";

// core components
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import SidenavList from "./SidenavList";
import SidenavItem from "./SidenavItem";
import SidenavCollapse from "./SidenavCollapse";

// style
import SidenavRoot from "./SidenavRoot";
import sidenavLogoLabel from "./styles/sidenav";

// store
import { isAdminGroup } from "utils/roles";
import { selectUser } from "pages/SignInPage/slice/selectors";
import { selectThemeSetting } from "components/Tenant/slice/selectors";
import { useSlice as useTenantSlice } from "components/Tenant/slice";

// Declaring props types for Sidenav
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  brand?: string;
  brandName: string;
  routes: {
    [key: string]:
      | ReactNode
      | string
      | {
          [key: string]:
            | ReactNode
            | string
            | {
                [key: string]: ReactNode | string;
              }[];
        }[];
  }[];
  [key: string]: any;
}

function Sidenav({ color, brand, brandName, routes, ...rest }: Props): JSX.Element {
  const [openCollapse, setOpenCollapse] = useState<boolean | string>(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState<boolean | string>(false);

  const dispatch = useDispatch();
  const { actions: tenantActions } = useTenantSlice();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    useSelector(selectThemeSetting);

  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];
  const user = useSelector(selectUser);

  let textColor:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "dark"
    | "white"
    | "inherit"
    | "text"
    | "light" = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => dispatch(tenantActions.updateThemeRequest({ miniSidenav: true }));

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, [collapseName, itemParentName]);

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse: any) => {
    const template = collapse.map(({ name, route, key, href }: any) =>
      href ? (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavItem name={name} nested />
        </Link>
      ) : (
        <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
          <SidenavItem name={name} active={route === pathname} nested />
        </NavLink>
      )
    );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses: any) =>
    collapses.map(({ name, collapse, route, href, key }: any) => {
      let returnValue;

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={color}
            name={name}
            active={key === itemParentName ? "isParent" : false}
            open={openNestedCollapse === key}
            onClick={({ currentTarget }: any) =>
              openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem color={color} name={name} active={key === itemName} />
          </Link>
        ) : (
          <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
            <SidenavItem color={color} name={name} active={route === pathname} />
          </NavLink>
        );
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({
      type,
      name,
      icon,
      title,
      collapse,
      noCollapse,
      key,
      href,
      route,
      handler,
      isExternal,
    }: any) => {
      let returnValue;

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          );
        } else {
          // here
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              open={openCollapse === key}
              onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          );
        }
      } else if (type === "switchScreen" && user?.roles?.some(e => isAdminGroup(e.name))) {
        returnValue = (
          <MDBox key={key} color={textColor} mb={1} mx={2} onClick={handler}>
            <SidenavItem name={name} active={route === pathname} icon={icon} nested />
          </MDBox>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      } else if (type === "page") {
        if (isExternal) {
          returnValue = (
            <Link href={route} key={key} rel="noreferrer" sx={{ textDecoration: "none" }}>
              <MDBox key={key} color={textColor} mb={1} mx={2}>
                <SidenavItem name={name} active={route === pathname} icon={icon} nested />
              </MDBox>
            </Link>
          );
        } else {
          returnValue = (
            <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
              <MDBox key={key} color={textColor} mb={1} mx={2}>
                <SidenavItem name={name} active={route === pathname} icon={icon} nested />
              </MDBox>
            </NavLink>
          );
        }
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" height="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme: any) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Declaring default props for Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

export default Sidenav;
