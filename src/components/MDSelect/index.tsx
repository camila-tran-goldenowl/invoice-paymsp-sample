import * as React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

interface IMDSelectProps {
  label: string;
  data: Array<{ value: string; text: string }>;
  handleChange: (value) => void;
  isMultiple: boolean;
  styled?: any;
  isDisable?: boolean;
  defaultValue?: any;
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MDSelect = ({
  label,
  data,
  handleChange,
  styled,
  isDisable,
  defaultValue,
}: IMDSelectProps): JSX.Element => {
  const theme = useTheme();
  const [chooseItem, setChooseItem] = React.useState([defaultValue]);

  const onChange = event => {
    const {
      target: { value },
    } = event;
    handleChange(value);
    setChooseItem(value);
  };

  return (
    <div>
      <FormControl sx={{ width: 150, ...styled }} disabled={isDisable}>
        <Select
          value={chooseItem}
          onChange={onChange}
          MenuProps={MenuProps}
          sx={{ width: 150, height: "2.5rem", ...styled }}
          displayEmpty
          multiple={false}
          input={<OutlinedInput />}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>{label}</em>
          </MenuItem>
          {data.map(item => (
            <MenuItem
              key={item.value}
              value={item.value}
              style={getStyles(item.value, chooseItem, theme)}
            >
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

MDSelect.defaultProps = {
  isDisable: false,
};

export default MDSelect;
