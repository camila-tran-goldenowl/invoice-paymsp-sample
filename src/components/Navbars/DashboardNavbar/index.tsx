/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";

// core components
import Tab from "@mui/material/Tab";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Tabs from "@mui/material/Tabs";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

// component
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";
import Breadcrumbs from "components/Breadcrumbs";
import NotificationItem from "components/Items/NotificationItem";

// custom styles
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "components/Navbars/DashboardNavbar/styles";

// store
import { useSlice } from "pages/SignInPage/slice/index";
import { useSlice as useTenantSlice } from "components/Tenant/slice";
import { selectThemeSetting } from "components/Tenant/slice/selectors";

// func
import { isSuperAdminRole } from "utils/roles";
import { useToastifySlice } from "components/Toastify/slice";
import { mapPage } from "components/GlobalSearch/data/mapPage";
import { useSlice as useSearchSlice } from "components/GlobalSearch/slice";
import { selectToastList, selectUnReadNumber } from "components/Toastify/slice/selectors";
import { selectSearchList, selectShowSearchList } from "components/GlobalSearch/slice/selectors";

import { tabList } from "./tabList";
import pxToRem from "assets/theme/functions/pxToRem";

// Declaring prop types
interface Props {
  absolute?: boolean;
  light?: boolean;
  isMini?: boolean;
  titleBreadcrumbs?: string;
  children?: ReactNode;
}

function DashboardNavbar({
  absolute,
  light,
  isMini,
  titleBreadcrumbs,
  children,
}: Props): JSX.Element {
  const [navbarType, setNavbarType] = useState<
    "fixed" | "absolute" | "relative" | "static" | "sticky"
  >();
  // openConfigurator
  const { actions: tenantActions } = useTenantSlice();
  const { miniSidenav, darkMode } = useSelector(selectThemeSetting);

  const [openMenu, setOpenMenu] = useState<any>(false);
  const [openProfile, setOpenProfile] = useState<any>(false);
  const [openSearch, setOpenSearch] = useState<any>(false);

  const currentPath = useLocation().pathname;
  const route = currentPath.split("/").slice(1);
  const [routesList, setRoutesList] = useState([]);

  const dispatch = useDispatch();
  const { actions } = useSlice();
  const { actions: notiActions } = useToastifySlice();
  const { actions: searchActions } = useSearchSlice();
  const searchList = useSelector(selectSearchList);
  const notificationList = useSelector(selectToastList);
  const unReadNo = useSelector(selectUnReadNumber);
  const isShowSearchList = useSelector(selectShowSearchList);

  useEffect(() => {
    const mapRoutes = route.map((item, index) => {
      return {
        label: item,
        to: currentPath
          .split("/")
          .slice(1)
          .slice(0, index + 1)
          .join("/"),
      };
    });
    setRoutesList(mapRoutes);
  }, []);

  const [transparentNavbar, setTransparentNavbar] = useState(true);
  const navigator = useNavigate();

  const [fixedNavbar, setFixedNavbar] = useState(false);
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.

    const handleTransparentNavbar = () => {
      setFixedNavbar(window.scrollY !== 0);

      setTransparentNavbar((fixedNavbar && window.scrollY === 0) || !fixedNavbar);
      // setFixedNavbar((fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", handleTransparentNavbar);

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [fixedNavbar]);

  const handleMiniSidenav = () =>
    dispatch(tenantActions.updateThemeRequest({ miniSidenav: !miniSidenav }));
  const handleOpenMenu = (event: any) => {
    setOpenMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
    dispatch(notiActions.clearNotifyList());
  };
  const handleOpenAccount = (event: any) => {
    setOpenProfile(event.currentTarget);
  };
  const handleOpenSearch = (event: any) => {
    setOpenSearch(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setOpenSearch(false);
    dispatch(searchActions.closeSearchList());
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const renderIcon = type => {
    switch (type) {
      case "info":
        return <Icon>notifications</Icon>;
      case "success":
        return <Icon>check</Icon>;
      case "error":
        return <Icon>warning</Icon>;

      default:
        return <Icon>notifications</Icon>;
    }
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notificationList.map(item => (
        <NotificationItem
          title={item.title}
          icon={renderIcon(item.type)}
          isRead={item.isRead}
          handleClick={() => {
            if (item.from === "sync-invoice") {
              navigator("/report/invoice-sync?status=error");
            } else if (item.from === "sync-email") {
              navigator("/report/email-log?status=error");
            } else {
              navigator("/report/audit-log");
            }
          }}
        />
      ))}
      {!notificationList.length && <NotificationItem title={`No notifications`} />}
    </Menu>
  );

  // Render the notifications menu
  const handleLogout = () => {
    dispatch(actions.signOutSuccess());
    navigator("/sign-in");
  };

  const handleProfile = () => {
    navigator("/profile");
  };

  const handleUser = () => {
    navigator("/user-settings");
  };

  const renderProfile = () => (
    <Menu
      anchorEl={openProfile}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openProfile)}
      onClose={handleCloseProfile}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        icon={<Icon>account_circle</Icon>}
        title="Profile"
        handleClick={handleProfile}
      />

      {isSuperAdminRole() && (
        <NotificationItem
          icon={<Icon>list_icon</Icon>}
          title="Users Settings"
          handleClick={handleUser}
        />
      )}

      <NotificationItem icon={<Icon>logout</Icon>} title="Logout" handleClick={handleLogout} />
    </Menu>
  );

  const [filterSearch, setFilterSearch] = useState(0);
  const handleFilterSearch = (event: React.SyntheticEvent, newValue: number) => {
    setFilterSearch(newValue);
  };

  const memoizedValue = useMemo(() => {
    const nameTab = tabList[filterSearch].value;
    if (nameTab === "all") {
      return searchList;
    }

    return searchList.filter(item => {
      return item.table_name === nameTab;
    });
  }, [filterSearch, searchList]);

  const renderTab = () => {
    return (
      <MDBox position="static">
        <Tabs value={filterSearch} orientation={"horizontal"} onChange={handleFilterSearch}>
          {tabList.map(item => (
            <Tab key={item.label} sx={{ fontSize: "0.8rem" }} label={item.label} />
          ))}
        </Tabs>
      </MDBox>
    );
  };

  const renderSearch = () => (
    <Menu
      anchorEl={openSearch}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(isShowSearchList)}
      onClose={handleCloseSearch}
      sx={{ mt: 2, minWidth: pxToRem(500) }}
    >
      <MDBox sx={{ minWidth: pxToRem(500) }}>
        {renderTab()}

        {!memoizedValue.length ? (
          <NotificationItem title={`No result`} />
        ) : (
          <MDBox mt={3}>
            {memoizedValue.map(item => (
              <MDBox>
                <NotificationItem
                  key={item.id}
                  title={`${mapPage[item.table_name].label}: ${
                    item.table_name === "users"
                      ? `${item.first_name ?? ""} ${item.last_name ?? ""} `
                      : item[mapPage[item.table_name].field]
                  }`}
                  handleClick={() => {
                    dispatch(searchActions.closeSearchList());
                    navigator(`/${item.table_name}/${item.id}`, { replace: true });
                  }}
                />
                <hr />
              </MDBox>
            ))}
          </MDBox>
        )}
      </MDBox>
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }: {
    palette: any;
    functions: any;
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const updateFeeDebounce = useCallback(
    debounce(value => {
      dispatch(searchActions.clearSearchList());
      setFilterSearch(0);
      dispatch(searchActions.getListRequest(value));
    }, 1000),
    []
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={theme => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      id="navigation"
    >
      <Toolbar sx={navbarContainer}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={theme => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            title={titleBreadcrumbs || route[route.length - 1]}
            route={routesList}
            light={light}
          />
          <IconButton sx={navbarDesktopMenu} onClick={handleMiniSidenav} size="small" disableRipple>
            <Icon fontSize="medium" sx={iconsStyle}>
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={theme => navbarRow(theme, { isMini })}>
            {children}
            <MDBox pr={1}>
              <MDInput
                label="Search here"
                onChange={e => updateFeeDebounce(e.target.value)}
                onClick={handleOpenSearch}
              />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleOpenAccount}
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenMenu}
              >
                <MDBadge badgeContent={unReadNo} color="error" size="xs" circular>
                  <Icon sx={iconsStyle}>notifications</Icon>
                </MDBadge>
              </IconButton>
              {renderMenu()}
              {renderProfile()}
              {renderSearch()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Declaring default props for DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

export default DashboardNavbar;
