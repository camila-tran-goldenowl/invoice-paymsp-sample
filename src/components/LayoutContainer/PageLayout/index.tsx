// libs
import { ReactNode } from "react";

// components
import MDBox from "components/MDBox";

// Declaring props types for PageLayout
interface Props {
  background?: "white" | "light" | "default";
  children: ReactNode;
}

function PageLayout({ background = "default", children }: Props): JSX.Element {
  return (
    <MDBox width="100vw" bgColor={background} sx={{ overflowX: "hidden" }}>
      {children}
    </MDBox>
  );
}

export default PageLayout;
