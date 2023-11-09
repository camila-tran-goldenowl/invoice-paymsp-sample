// libs
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import colors from "assets/theme/base/colors";

const textStyles = {
  color: colors.grey[700],
  fontSize: "0.875rem",
  fontFamily: "Roboto,Helvetica, Arial sans-serif",
};

interface IPhoneNumberInputProps {
  value: string;
  handleChange: (value) => void;
}

const PhoneNumberInput = ({ handleChange, value }: IPhoneNumberInputProps) => {
  return (
    <PhoneInput
      value={value}
      inputProps={{
        name: "Phone number",
        required: true,
        autoFocus: true,
      }}
      enableSearch={true}
      country="us"
      containerStyle={{
        ...textStyles,
        marginBottom: "4px",
        marginTop: "8px",
      }}
      inputStyle={{
        ...textStyles,
        paddingBottom: "0.9em",
        paddingTop: "0.9em",
        width: "100%",
        borderColor: colors.inputBorderColor,
        backgroundColor: "transparent",
      }}
      searchStyle={{
        ...textStyles,
        margin: 0,
        width: "90%",
        borderColor: colors.inputBorderColor,
        backgroundColor: "transparent",
      }}
      dropdownStyle={textStyles}
      onChange={phoneInput => {
        handleChange(phoneInput);
      }}
      specialLabel="Phone number"
    />
  );
};

export default PhoneNumberInput;
