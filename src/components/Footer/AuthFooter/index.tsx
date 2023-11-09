/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// libs
import moment from "moment";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Theme } from "@mui/material/styles";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS Base Styles
import { ENV } from "utils/constants";

function Footer({ light }: { light?: boolean }): JSX.Element {
  return (
    <MDBox width="100%" bottom={0} py={4}>
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column-reverse", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox display={"flex"}>
            <MDTypography variant="body2" fontWeight="light" color={light ? "text" : "secondary"}>
              Copyright © {moment().year()}{" "}
            </MDTypography>
            <Link href={`${ENV.LANDING_PAGE_URL}`}>
              <MDBox ml={1}>
                <MDTypography
                  variant="body2"
                  fontWeight="light"
                  color={light ? "text" : "secondary"}
                >
                  PayMSP Inc.
                </MDTypography>
              </MDBox>
            </Link>
          </MDBox>

          <MDBox
            component="ul"
            sx={({ breakpoints }: Theme) => ({
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              listStyle: "none",
              mt: 3,
              mb: 0,
              p: 0,

              [breakpoints.up("lg")]: {
                mt: 0,
              },
            })}
          >
            <MDBox component="li" pr={2} lineHeight={1}>
              <Link href={ENV.LANDING_PAGE_URL}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  Company
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href={`${ENV.LANDING_PAGE_URL}/about-us`}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  About Us
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href={`${ENV.LANDING_PAGE_URL}/products`}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  Products
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" pl={2} lineHeight={1}>
              <Link href={`${ENV.LANDING_PAGE_URL}/privacy`}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  Privacy Policy
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" pl={2} lineHeight={1}>
              <Link href={`${ENV.LANDING_PAGE_URL}/terms-of-use`}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  Terms of Use
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" pl={2} lineHeight={1}>
              <Link href={`${ENV.LANDING_PAGE_URL}/contact-us`}>
                <MDTypography
                  variant="body2"
                  fontWeight="regular"
                  color={light ? "white" : "secondary"}
                >
                  Contact Us
                </MDTypography>
              </Link>
            </MDBox>
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Declaring default props for Footer
Footer.defaultProps = {
  light: false,
};

export default Footer;
