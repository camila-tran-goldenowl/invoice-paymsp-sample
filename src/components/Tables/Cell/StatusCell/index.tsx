// core components
import Icon from "@mui/material/Icon";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";

// Declaring props types for StatusCell
interface Props {
  icon: string;
  color:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "dark"
    | "light"
    | "white"
    | "default";
  status: string;
}

function StatusCell({ icon, color, status }: Props): JSX.Element {
  return (
    <MDBox display="flex" alignItems="center">
      <MDBox mr={1}>
        <MDButton variant="outlined" color={color} size="small" iconOnly circular>
          <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
        </MDButton>
      </MDBox>
      <MDTypography
        variant="caption"
        fontWeight="medium"
        sx={{ lineHeight: 0, color: colors.text.main }}
      >
        {status}
      </MDTypography>
    </MDBox>
  );
}

export default StatusCell;
