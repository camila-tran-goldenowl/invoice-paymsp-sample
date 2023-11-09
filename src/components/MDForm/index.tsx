// libs
import { ReactNode } from "react";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface IFormProps {
  children: ReactNode;
  title: string;
  width?: string | { [key: string]: string };
}

const MDForm = ({ children, title, width }: IFormProps): JSX.Element => {
  return (
    <MDBox sx={{ width }}>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          {title}
        </MDTypography>
      </MDBox>

      <MDBox pt={4} pb={3} px={3}>
        {children}
      </MDBox>
    </MDBox>
  );
};

export default MDForm;
