// libs
import { ReactNode } from "react";

// core components
import List from "@mui/material/List";

function SidenavList({ children }: { children: ReactNode }): JSX.Element {
  return (
    <List
      sx={{
        px: 2,
        my: 0.3,
      }}
    >
      {children}
    </List>
  );
}

export default SidenavList;
