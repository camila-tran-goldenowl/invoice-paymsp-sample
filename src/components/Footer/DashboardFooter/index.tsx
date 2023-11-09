// libs
import moment from "moment";

// core components
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

// components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// data
import { ENV } from "utils/constants";

interface IDashboardFooterProps {
  links?: Array<{ href: string; name: string }>;
}

const DashboardFooter = ({ links }: IDashboardFooterProps): JSX.Element => {
  const renderLinks = links.map(link => (
    <MDTypography
      key={link.name}
      component={Link}
      href={link.href}
      variant="body2"
      color="secondary"
      fontWeight="regular"
      target="_blank"
    >
      {link.name}
    </MDTypography>
  ));

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <MDBox display="flex" alignItems="baseline">
        <MDTypography variant="body2" color="secondary">
          Copyright © {moment().year()}{" "}
        </MDTypography>
        <MDBox ml={1}>
          <MDTypography
            key="Bluelink Systems"
            component={Link}
            href={`${ENV.LANDING_PAGE_URL}`}
            variant="body2"
            color="secondary"
            target="_blank"
          >
            PayMSP Inc.
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mb={3} />
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        spacing={{ xs: 2, lg: 3, xl: 6 }}
      >
        {renderLinks}
      </Stack>
    </MDBox>
  );
};
// Setting default values for the props of CenteredFooter
DashboardFooter.defaultProps = {
  links: [
    { href: `${ENV.LANDING_PAGE_URL}/privacy`, name: "Privacy Policy" },
    { href: `${ENV.LANDING_PAGE_URL}/terms-of-use`, name: "Terms of Use" },
  ],
  light: false,
};

export default DashboardFooter;
