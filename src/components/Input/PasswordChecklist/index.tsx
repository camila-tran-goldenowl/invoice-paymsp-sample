// libs
import { useDarkmode } from "hooks/useDarkmode";

// components
import MDBox from "components/MDBox";
import PasswordChecklist from "react-password-checklist";
import PasswordStrengthBar from "react-password-strength-bar";
import PasswordChecklistRoot from "./PasswordChecklistRoot";

// styles
import pxToRem from "assets/theme/functions/pxToRem";

interface IPasswordCheckProps {
  value: string;
  handleValid: () => void;
}

const PasswordCheck = ({ value, handleValid }: IPasswordCheckProps) => {
  const darkMode = useDarkmode();

  return (
    <MDBox>
      <MDBox sx={{ maxWidth: pxToRem(200) }}>
        <PasswordStrengthBar password={value} />
      </MDBox>

      <PasswordChecklistRoot
        ownerState={{
          darkMode,
        }}
      >
        <PasswordChecklist
          rules={["minLength", "specialChar", "number", "capital", "lowercase"]}
          minLength={8}
          value={value}
          messages={{
            minLength: "At least 8 characters.",
            number: "At least 1 number character.",
            capital: "At least 1 capital character.",
            lowercase: "At least 1 small character.",
            specialChar: "At least 1 special character.",
          }}
          style={{
            alignItems: "center",
          }}
          onChange={isValid => {
            if (isValid) {
              handleValid();
            }
          }}
        />
      </PasswordChecklistRoot>
    </MDBox>
  );
};

export default PasswordCheck;
