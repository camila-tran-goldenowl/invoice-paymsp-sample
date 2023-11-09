// libs
import { useState } from "react";

// core component
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface IMultipleSelectProps {
  label: string;
  data: Array<{ value: string; text: string }>;
  handleChange: (field, value) => void;
  isMultiple: boolean;
  styled?: any;
  name?: string;
  isDisable?: boolean;
  defaultValue?: { value: string; text: string };
}

const MultipleSelect = ({
  label,
  data,
  handleChange,
  isMultiple,
  isDisable,
  name,
  defaultValue,
}: IMultipleSelectProps): JSX.Element => {
  const [chooseItem, setChooseItem] = useState(defaultValue);

  const onChange = (event, value) => {
    handleChange(name, value);
    setChooseItem(value);
  };

  return (
    <Autocomplete
      disabled={isDisable}
      multiple={isMultiple}
      options={data}
      getOptionLabel={(data: { value: any; text: string }) => data?.text || ""}
      value={chooseItem?.text && chooseItem?.value ? chooseItem : defaultValue}
      renderInput={params => <TextField {...params} variant="standard" label={label} name={name} />}
      onChange={onChange}
    />
  );
};

MultipleSelect.defaultProps = {
  isDisable: false,
};

export default MultipleSelect;
