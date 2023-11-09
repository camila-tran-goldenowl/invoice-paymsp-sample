// libs
import { forwardRef, FC, ReactNode } from "react";

// core components
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import { MenuItemProps } from "@mui/material";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// styles
import menuItem from "./styles";

// Declaring props types for NotificationItem
interface Props extends MenuItemProps {
  icon?: ReactNode;
  title: string;
  isRead?: boolean;
  [key: string]: any;
  handleClick?: () => void;
}

const NotificationItem: FC<Props> = forwardRef(
  ({ icon, title, handleClick, isRead, ...rest }, ref) => (
    <MenuItem {...rest} ref={ref} sx={theme => menuItem(theme)}>
      <MDBox
        component={Link}
        py={0.5}
        display="flex"
        alignItems="center"
        lineHeight={1}
        onClick={() => handleClick && handleClick()}
      >
        <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
          {icon}
        </MDTypography>
        <MDTypography
          variant="button"
          fontWeight="regular"
          sx={{ ml: 1, fontWeight: !isRead ? "bold" : "regular" }}
        >
          {title}
        </MDTypography>
      </MDBox>
    </MenuItem>
  )
);

export default NotificationItem;
