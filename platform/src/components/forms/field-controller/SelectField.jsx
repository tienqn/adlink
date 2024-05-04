import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import lodash from "lodash";

function SelectField({
  name,
  label,
  control,
  dataOptions,
  selectKey,
  selectValue,
  isCustomData,
  disabled = false,
  optionSelected = [],
  onChange,
  ...other
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, formState }) => {
        const { errors } = formState;
        const message = lodash.get(errors, `${name}.message`, false);
        return (
          <FormControl
            fullWidth
            variant="outlined"
            error={message ? true : false}
            {...other}
          >
            {label ? (
              <InputLabel
                id="input_designationselected"
                style={{
                  backgroundColor: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              >
                {label}
              </InputLabel>
            ) : null}
            <Select {...field}>
              {dataOptions.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item[`${selectKey}`]}
                  disabled={optionSelected.includes(item[`${selectKey}`])}
                >
                  {item[`${selectValue}`]}
                </MenuItem>
              ))}
            </Select>
            {Boolean(message) && <FormHelperText>{message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}

export default SelectField;
