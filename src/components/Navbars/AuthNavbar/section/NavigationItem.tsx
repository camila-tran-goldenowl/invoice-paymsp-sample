import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { ENV } from "utils/constants";

interface INavigationItem {
  href: string;
  label: string;
  light?: Boolean;
  icon: string;
}

const NavigationItem = ({ href, label, light, icon }: INavigationItem) => (
  <MDBox
    component="a"
    href={`${ENV.LANDING_PAGE_URL}#${href}`}
    key={label}
    mx={1}
    p={1}
    display="flex"
    alignItems="baseline"
    color={light ? "white" : "dark"}
    opacity={light ? 1 : 0.6}
    sx={{ cursor: "pointer", userSelect: "none" }}
  >
    <MDTypography variant="body2" color={light ? "white" : "dark"}>
      <Icon sx={{ fontWeight: "normal", verticalAlign: "middle" }}>{icon}</Icon>
    </MDTypography>
    <MDTypography
      variant="button"
      fontWeight="regular"
      textTransform="capitalize"
      color={light ? "white" : "dark"}
      sx={{ fontWeight: "100%", ml: 1, mr: 0.25 }}
    >
      {label}
    </MDTypography>
  </MDBox>
);

export default NavigationItem;
