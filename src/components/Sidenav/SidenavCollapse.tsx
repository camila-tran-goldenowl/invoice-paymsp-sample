// libs
import { ReactNode } from "react";
import { useSelector } from "react-redux";

// core components
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// components
import MDBox from "components/MDBox";

// styles
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
  collapseArrow,
} from "./styles/sidenavCollapse";

// store
import { selectThemeSetting } from "components/Tenant/slice/selectors";

interface Props {
  icon: ReactNode;
  name: string;
  children?: ReactNode;
  active?: Boolean;
  noCollapse?: Boolean;
  open?: Boolean;
  [key: string]: any;
}

function SidenavCollapse({
  icon,
  name,
  children,
  active,
  noCollapse,
  open,
  ...rest
}: Props): JSX.Element {
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    useSelector(selectThemeSetting);

  return (
    <>
      <ListItem component="li">
        <MDBox
          {...rest}
          sx={(theme: any) =>
            collapseItem(theme, { active, transparentSidenav, whiteSidenav, darkMode })
          }
        >
          <ListItemIcon
            sx={theme => collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode })}
          >
            {typeof icon === "string" ? (
              <Icon sx={theme => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={theme =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />

          <Icon
            sx={theme =>
              collapseArrow(theme, {
                noCollapse,
                transparentSidenav,
                whiteSidenav,
                miniSidenav,
                open,
                active,
                darkMode,
              })
            }
          >
            expand_less
          </Icon>
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={Boolean(open)} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Declaring default props for SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
  noCollapse: false,
  children: false,
  open: false,
};

export default SidenavCollapse;
