import { TextField, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";

function MultiSelectField({
  name,
  label,
  control,
  selectKey,
  selectValue,
  dataOptions = [],
  ...other
}) {
  return (
    <Controller
      name={name}
      control={control}
      // defaultValue={[]}
      render={(data) => {
        const { field, fieldState } = data;
        const message = fieldState?.error?.message;

        return (
          <Autocomplete
            {...field}
            multiple
            options={dataOptions}
            forcePopupIcon={false}
            getOptionLabel={(option) => {
              return `${option?.[`${selectValue}`]}`;
            }}
            // value={field?.id}
            onChange={(e, value) => {
              const dataChange = value.map((item) => {
                return item[`${selectKey}`] || item;
              });
              field.onChange(dataChange);
            }}
            {...other}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                return (
                  <Chip
                    variant="outlined"
                    label={option?.[`${selectValue}`] || option}
                    color="primary"
                    {...getTagProps({ index })}
                  />
                );
              })
            }
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "5px !important",
                    },
                  }}
                  label={label}
                  variant="outlined"
                  fullWidth
                  error={Boolean(message)}
                  helperText={message}
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              );
            }}
          />
        );
      }}
    />
  );
}

export default MultiSelectField;
