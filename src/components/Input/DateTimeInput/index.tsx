// libs
import moment from "moment";
import get from "lodash/get";
import { Controller } from "react-hook-form";
import { useDarkmode } from "hooks/useDarkmode";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// components
import MDInput from "components/MDInput";

// styles
import colors from "assets/theme/base/colors";

export default function DateTimeInput({ control, label, name, errors, value, ...params }) {
  const darkMode = useDarkmode();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange }, fieldState: { invalid, error } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label={label}
              value={value}
              inputFormat="YYYY-MM-DD"
              onChange={event => {
                if (event?._d) {
                  const newValue = moment(event?._d).format("YYYY-MM-DD");
                  onChange(newValue);
                } else onChange("");
              }}
              renderInput={params => (
                <MDInput
                  {...params}
                  variant="standard"
                  label={label}
                  name={name}
                  fullWidth
                  control={control}
                  sx={{
                    svg: { color: darkMode ? colors.white.main : colors.dark.main },
                  }}
                  helperText={get(errors, name) && get(errors, name).message.split("].").pop()}
                />
              )}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
}
