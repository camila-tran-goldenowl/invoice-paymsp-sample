// libs
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

// components
import MDTypography from "components/MDTypography";

interface ILinkCellProps {
  to: string;
  children: ReactNode;
}

const LinkCell = ({ to, children }: ILinkCellProps) => {
  return (
    <NavLink to={to}>
      <MDTypography
        variant="button2"
        fontWeight="regular"
        sx={{
          "&:hover": {
            textDecoration: "underline !important",
            textUnderlineOffset: "5px",
          },
        }}
      >
        {children}
      </MDTypography>
    </NavLink>
  );
};

export default LinkCell;
