// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// style
import colors from "assets/theme-dark/base/colors";

interface ITitleBoxProps {
  title: string;
}

const TitleBox = ({ title }: ITitleBoxProps): JSX.Element => (
  <MDBox
    display="flex"
    alignItems="center"
    sx={{
      backgroundColor: colors.dark.main,
      width: "100%",
      padding: `0.6rem 1rem`,
    }}
    fontWeight={700}
    borderRadius="lg"
    mb={1}
  >
    <MDTypography variant="button" color="white">
      {title}
    </MDTypography>
  </MDBox>
);

export default TitleBox;
