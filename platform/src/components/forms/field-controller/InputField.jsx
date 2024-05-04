import { TextField, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  iconButton: {
    cursor: "pointer",
    "&__icon": {
      color: "rgb(99, 115, 129)",
    },
  },
}));

function InputField({
  type = "text",
  disabled = false,
  name,
  label,
  control,
  placeholder,
  defaultValue,
  isPasscodeField,
  onChange,
  onInput,
  labelDisabled,
  clearable,
  inputProps = {},
  InputProps = {},
  ...other
}) {
  const classes = useStyles();
  const renderEndAdornment = (field) =>
    clearable && field.value ? (
      <InputAdornment
        position="end"
        sx={{
          backgroundColor: (theme) => "#ECF4FD",
          padding: "27.5px 19px",
          "& .MuiInputAdornment-root": {
            marginLeft: 0,
          },
          cursor: "pointer",
        }}
        onClick={(e) => {
          if (clearable && field.value) {
            field.onChange("");
          }
        }}
      >
        <ClearIcon className={`${classes.iconButton}__icon`} />
      </InputAdornment>
    ) : (
      InputProps.endAdornment
    );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const { onChange, value } = field;
        const { errors } = formState;
        return (
          <TextField
            value={value}
            fullWidth
            disabled={disabled}
            variant="outlined"
            InputLabelProps={{ shrink: !labelDisabled }}
            type={type}
            label={labelDisabled ? null : label}
            placeholder={placeholder}
            InputProps={{
              endAdornment: renderEndAdornment(field),
              ...InputProps,
            }}
            onChange={(e) => onChange(e)}
            error={Boolean(errors[name])}
            helperText={Boolean(errors[name]) && errors[name].message}
            {...other}
          />
        );
      }}
    />
  );
}

export default InputField;
