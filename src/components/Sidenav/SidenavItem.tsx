// libs
import { ReactNode } from "react";
import { useSelector } from "react-redux";

// core components
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import { Theme } from "@mui/material/styles";

//components
import MDBox from "components/MDBox";

// styles
import { collapseIconBox, collapseIcon } from "./styles/sidenavCollapse";
import { item, itemContent, itemArrow, itemText } from "./styles/sidenavItem";

// store
import { selectThemeSetting } from "components/Tenant/slice/selectors";

// Declaring props types for SidenavCollapse
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  name: string;
  active?: boolean | string;
  nested?: boolean;
  children?: ReactNode;
  open?: boolean;
  [key: string]: any;
  icon?: boolean;
}

function SidenavItem({
  color,
  name,
  active,
  nested,
  children,
  open,
  icon,
  ...rest
}: Props): JSX.Element {
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    useSelector(selectThemeSetting);

  return (
    <>
      <ListItem
        {...rest}
        component="li"
        sx={theme =>
          item(theme, {
            active,
            color,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            isChild: !Boolean(icon),
          })
        }
      >
        <MDBox
          sx={(theme: Theme): any =>
            itemContent(theme, {
              active,
              miniSidenav,
              name,
              open,
              nested,
              transparentSidenav,
              whiteSidenav,
              darkMode,
              isChild: !Boolean(icon),
            })
          }
        >
          {icon && (
            <ListItemIcon
              sx={theme => collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode })}
            >
              {typeof icon === "string" ? (
                <Icon sx={theme => collapseIcon(theme, { active })}>{icon}</Icon>
              ) : (
                icon
              )}
            </ListItemIcon>
          )}
          <ListItemText
            primary={name}
            sx={theme =>
              itemText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />
          {children && (
            <Icon
              component="i"
              sx={theme =>
                itemArrow(theme, { open, miniSidenav, transparentSidenav, whiteSidenav, darkMode })
              }
            >
              expand_less
            </Icon>
          )}
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit {...rest}>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Declaring default props for SidenavItem
SidenavItem.defaultProps = {
  color: "info",
  active: false,
  nested: false,
  children: false,
  open: false,
};

export default SidenavItem;
