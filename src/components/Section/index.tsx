// libs
import { ReactNode } from "react";

// components
import TitleBox from "./Title";
import MDBox from "components/MDBox";

interface ITitleBoxProps {
  children: ReactNode;
  title: string;
}

const Section = ({ title, children }: ITitleBoxProps): JSX.Element => (
  <MDBox>
    <TitleBox title={title} />
    <MDBox my={2}>{children}</MDBox>
  </MDBox>
);

export default Section;
