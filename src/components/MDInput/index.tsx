import { FC, forwardRef } from "react";
import { useDarkmode } from "hooks/useDarkmode";

// @mui material components
import { OutlinedTextFieldProps, StandardTextFieldProps } from "@mui/material";

// Custom styles for MDInput
import MDInputRoot from "components/MDInput/MDInputRoot";

// Declaring props types for MDInput
interface Props extends Omit<OutlinedTextFieldProps | StandardTextFieldProps, "variant"> {
  variant?: "standard" | "outlined";
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
}

const MDInput: FC<Props | any> = forwardRef(({ error, success, disabled, ...rest }, ref) => {
  const darkMode = useDarkmode();

  return (
    <MDInputRoot
      {...rest}
      ref={ref}
      variant="outlined"
      ownerState={{ error, success, disabled, darkMode }}
      inputProps={{
        ...rest.inputProps,
        autoComplete: "new-password",
      }}
      sx={{
        mb: "4px",
        mt: "8px",
      }}
    />
  );
});

// Declaring default props for MDInput
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

export default MDInput;
