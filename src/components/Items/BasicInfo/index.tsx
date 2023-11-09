import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface IBasicInfoProps {
  label: string;
  value?: string | number;
  styles?: {
    value?: {
      variant: string;
    };
    label?: {
      variant: string;
    };
  };
}

export const BasicInfo = ({ label, value, styles }: IBasicInfoProps): JSX.Element => {
  return (
    <MDBox m={2} lineHeight={0}>
      <MDTypography variant={styles?.label?.variant ?? "button"} fontWeight="medium" color="text">
        {label}
      </MDTypography>
      <MDBox my={2} lineHeight={1}>
        <MDTypography variant={styles?.value?.variant ?? "h5"} fontWeight="bold" color="dark">
          {value}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default BasicInfo;
