// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const LabelStatus = ({ color, text }) => {
  return (
    <MDBox
      borderRadius="lg"
      sx={{
        backgroundColor: color,
        p: 1,
        mr: 1,
        width: "fit-content",
        display: "flex",
        alignItems: "center",
      }}
    >
      <MDTypography
        component="span"
        variant="button"
        fontSize="x-small"
        verticalAlign="center"
        color="white"
        fontWeight="medium"
        sx={{ lineHeight: 0 }}
      >
        {text}
      </MDTypography>
    </MDBox>
  );
};

export default LabelStatus;
