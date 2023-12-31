// libs
import { useState, useEffect, ReactNode } from "react";

// core components
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// components
import MDBox from "components/MDBox";

// styles
import breakpoints from "assets/theme/base/breakpoints";

import DashboardNavbar from "components/Navbars/DashboardNavbar";
import DashboardLayout from "components/LayoutContainer/DashboardLayout";

// Declaring props types for BaseLayout
interface Props {
  stickyNavbar?: boolean;
  children: ReactNode;
  titleBreadcrumbs?: string;
}

function BaseLayout({ stickyNavbar, children, titleBreadcrumbs }: Props): JSX.Element {
  const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event: any, newValue: number) => setTabValue(newValue);

  return (
    <DashboardLayout>
      <DashboardNavbar absolute={!stickyNavbar} isMini titleBreadcrumbs={titleBreadcrumbs} />
      <MDBox mt={stickyNavbar ? 3 : 10}>
        <Grid container>
          <Grid item xs={12} sm={8} lg={4}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab label="Messages" />
                <Tab label="Social" />
                <Tab label="Notifications" />
                <Tab label="Backup" />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </MDBox>
    </DashboardLayout>
  );
}

// Declaring default props for BaseLayout
BaseLayout.defaultProps = {
  stickyNavbar: false,
};

export default BaseLayout;
