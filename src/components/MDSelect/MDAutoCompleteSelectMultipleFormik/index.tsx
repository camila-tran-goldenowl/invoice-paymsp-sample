// libs
import { useState } from "react";
import { Field } from "formik";

// core components
import Autocomplete from "@mui/material/Autocomplete";

// components
import MDInput from "components/MDInput";

// type
import { IOptionSelect } from "types/UI";

interface IMultipleSelectProps {
  label?: string;
  data: Array<IOptionSelect>;
  handleChange?: (field, value?: string) => void;
  isMultiple: boolean;
  styled?: any;
  name?: string;
  isDisable?: boolean;
  [key: string]: any;
  setFieldValue?: (key, id) => void;
  defaultValue?: IOptionSelect;
}

const MultipleSelect = ({
  label,
  data,
  handleChange,
  isMultiple,
  isDisable,
  name,
  setFieldValue,
  defaultValue,
  ...rest
}: IMultipleSelectProps): JSX.Element => {
  const [chooseItem, setChooseItem] = useState<IOptions>(defaultValue);

  interface IOptions {
    value: string;
    text: string;
  }

  function isAnOption(obj: any): obj is IOptions {
    return "text" in obj && "value" in obj;
  }

  return (
    <Autocomplete
      disabled={isDisable}
      multiple={isMultiple}
      options={data}
      getOptionLabel={(data: { value: any; text: string }) => data?.text || ""}
      value={chooseItem?.text && chooseItem?.value ? chooseItem : defaultValue}
      onChange={(event, value) => {
        if (isAnOption(value)) {
          setChooseItem(value);
          handleChange(value);
          setFieldValue(name, value.value);
        }
      }}
      renderInput={params => {
        return (
          <Field
            {...rest}
            {...params}
            name={name}
            as={MDInput}
            variant="standard"
            label={label}
            fullWidth
            onChange={handleChange}
          />
        );
      }}
    />
  );
};

MultipleSelect.defaultProps = {
  isDisable: false,
};

export default MultipleSelect;
