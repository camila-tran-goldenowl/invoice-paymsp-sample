import get from "lodash/get";
import MDInput from "components/MDInput";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";
const getOptionSelected = (option, value) => {
  if (value?.value) return option.value === value.value;
};

export function RHFAutocompleteArray(props) {
  const renderOptionProps =
    props.renderOption instanceof Function
      ? {
          renderOption: (prop, option) => {
            return props.renderOption instanceof Function && props.renderOption(prop, option);
          },
        }
      : {};
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={props.defaultValue || props.items[0]}
      render={({ field }) => {
        return (
          <Autocomplete
            options={props.items || []}
            value={field.value}
            onChange={(event, item) => {
              const value = props.parseValue instanceof Function ? props.parseValue(item) : item;
              field.onChange(value);
            }}
            getOptionLabel={item => {
              return props.getOptionLabel instanceof Function
                ? props.getOptionLabel(item)
                : item
                ? item
                : "";
            }}
            {...renderOptionProps}
            noOptionsText={"Data is empty"}
            renderInput={params => (
              <MDInput
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                fullWidth
                label={props.label}
                margin="dense"
                type="text"
                error={!!get(props.errors, props.name)}
                helperText={get(props.errors, props.name) && get(props.errors, props.name).message}
              />
            )}
          />
        );
      }}
    />
  );
}

export function RHFAutocompleteArrayObject(props) {
  const renderOptionProps =
    props.renderOption instanceof Function
      ? {
          renderOption: (prop, option) => {
            return props.renderOption instanceof Function && props.renderOption(prop, option);
          },
        }
      : {};
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={{}}
      render={({ field }) => (
        <Autocomplete
          options={props.items || []}
          value={field.value ?? { value: "" }}
          onChange={(event, item) => {
            props.onChange instanceof Function && props.onChange(item);
            const value = props.parseValue instanceof Function ? props.parseValue(item) : item;
            value instanceof Object && value !== null ? field.onChange(value) : field.onChange({});
          }}
          isOptionEqualToValue={(option, value) =>
            props.getOptionSelected instanceof Function
              ? props.getOptionSelected(option, value)
              : getOptionSelected(option, value)
          }
          getOptionLabel={item =>
            props.getOptionLabel instanceof Function
              ? props.getOptionLabel(item)
              : item[props.getOptionLabel]
              ? item[props.getOptionLabel]
              : ""
          }
          {...renderOptionProps}
          noOptionsText={"Data is empty"}
          renderInput={params => (
            <MDInput
              {...params}
              fullWidth
              label={props.label}
              margin="dense"
              variant="standard"
              type={props.freeSoloType || "text"}
              error={!!get(props.errors, props.name)}
              helperText={
                get(props.errors, props.name) && get(props.errors, props.name)?.value?.message
              }
            />
          )}
        />
      )}
    />
  );
}
