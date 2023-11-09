import { Checkbox } from "@mui/material";
import { FC, forwardRef } from "react";

const MDCheckbox: FC<any> = forwardRef((props, ref) => <Checkbox {...props} ref={ref} />);

export default MDCheckbox;
