// libs
import get from "lodash/get";
import MDBox from "components/MDBox";
import { Controller } from "react-hook-form";

// components
import MDInput from "components/MDInput";

export function RHFTextField(props) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={""}
      render={({ field, fieldState: { invalid, error } }) => {
        return (
          <MDBox>
            <MDInput
              fullWidth
              inputRef={field.ref}
              className={props.className}
              onChange={event =>
                field.onChange(
                  props.parseValue instanceof Function
                    ? props.parseValue(event.target.value)
                    : event.target.value
                )
              }
              value={
                props.setValue instanceof Function ? props.setValue(field.value) : field.value ?? ""
              }
              type={props.type || "text"}
              disabled={props.disabled}
              label={props.label}
              variant={props.variant || "standard"}
              InputLabelProps={{ shrink: true }}
              InputProps={props.InputProps}
              multiline={props.multiline}
              minRows={props.minRows}
              maxRows={props.maxRows}
              defaultValue={props.defaultValue}
              error={!!get(props.errors, props.name)}
              helperText={
                get(props.errors, props.name) &&
                get(props.errors, props.name).message.split("].").pop()
              }
              placeholder={props.placeholder}
              onFocus={props?.onFocus}
              onBlur={props?.onBlur}
            />
            {/* {error?.message && (
              <MDTypography variant="button" fontWeight="regular" color="error">
                {error.message}
              </MDTypography>
            )} */}
          </MDBox>
        );
      }}
    />
  );
}
