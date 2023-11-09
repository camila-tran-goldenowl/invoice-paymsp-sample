/* eslint-disable react-hooks/exhaustive-deps */
// libs
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

// components
import MDBox from "components/MDBox";
import Footer from "components/Footer/AuthFooter";
import DefaultNavbar from "components/Navbars/AuthNavbar";
import PageLayout from "components/LayoutContainer/PageLayout";

// store
import { useSlice as useTenantSlice } from "components/Tenant/slice";
import { hostname, isAdminPage } from "utils/helperFunc";
import { selectTenant } from "components/Tenant/slice/selectors";

interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props): JSX.Element {
  const dispatch = useDispatch();

  const { actions: tenantActions } = useTenantSlice();
  const tenant = useSelector(selectTenant);

  React.useEffect(() => {
    dispatch(tenantActions.withoutLoggedFetchRequest({ hostname }));
  }, [dispatch, tenantActions]);

  return (
    <PageLayout>
      {isAdminPage && <DefaultNavbar sticky relative />}
      <MDBox
        my={!isAdminPage && tenant?.logo_url ? 0 : 5}
        mx="auto"
        display="flex"
        alignItems="center"
      >
        <Grid container spacing={1} justifyContent="center">
          <StyledWrapperLogo item xs={11} sm={9} md={5} lg={4} xl={3} className="section-to-print">
            {!isAdminPage && tenant?.logo_url && (
              <MDBox my={5}>
                <StyledLogo component="img" src={tenant.logo_url} alt="Brand" />
              </MDBox>
            )}
            {children}
          </StyledWrapperLogo>
        </Grid>
      </MDBox>
      {isAdminPage && <Footer />}
    </PageLayout>
  );
}

const StyledWrapperLogo = styled(Grid)(
  () => `
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 4rem,
`
);

const StyledLogo = styled(MDBox)(
  () => `
  width: 280px;
  height: auto;
`
);

export default AuthLayout;
