// libs
import { ReactNode } from "react";

// components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Declaring props types for DefaultInfoCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  icon: ReactNode;
  title: string;
  description?: string;
  value?: string | number;
  [key: string]: any;
  handleClick?: () => void;
}

function DefaultInfoCard({
  color,
  icon,
  title,
  description,
  value,
  handleClick,
}: Props): JSX.Element {
  return (
    <Card onClick={handleClick}>
      <MDBox p={2} mx={3} display="flex" justifyContent="center">
        <MDBox
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor="info"
          color="white"
          width="3rem"
          height="3rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
          position="relative"
        >
          <MDBox
            position="absolute"
            top="50%"
            left="50%"
            width="50%"
            height="50%"
            sx={{
              transform: "translate(-50%,-50%)",
              backgroundImage: `url(${icon})`,
              backgroundSize: "cover",
            }}
          />
        </MDBox>
      </MDBox>
      <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {description && (
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {description}
          </MDTypography>
        )}
        {description && !value ? null : <Divider />}
        {value && (
          <MDTypography variant="h5" fontWeight="medium" color={color}>
            {value}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

// Declaring default props for DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

export default DefaultInfoCard;
