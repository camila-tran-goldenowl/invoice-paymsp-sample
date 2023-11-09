// libs
import { ReactNode } from "react";

// core components
import { Theme } from "@mui/material/styles";

// components
import MDBox from "components/MDBox";

// Declaring prop types for DataTableBodyCell
interface Props {
  children: ReactNode;
  noBorder?: boolean;
  align?: "left" | "right" | "center";
  handleClick?: () => void;
  styles: {
    [key: string]: any;
  };
}

function DataTableBodyCell({ noBorder, align, children, handleClick, styles }: Props): JSX.Element {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }: Theme) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        ...styles,
      })}
      onClick={() => handleClick?.()}
    >
      <MDBox
        display="inline-block"
        width="max-content"
        color="text"
        sx={{ verticalAlign: "middle" }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

export default DataTableBodyCell;
