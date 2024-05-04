import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import InsertInvitationRoundedIcon from "@mui/icons-material/Event";

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

function DateTimeField({
  name,
  label,
  control,
  minDate,
  maxDate,
  inputFormat = "MM/DD/YYYY",
  views = ["year", "month", "day"],
  clearable = false,
  ...other
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const renderEndAdornment = (field) => (
    <IconButton
      className={classes.iconButton}
      onClick={(e) => {
        if (clearable && field.value) {
          e.stopPropagation();
          field.onChange(null);
        }
      }}
    >
      {clearable && field.value ? (
        <ClearIcon className={`${classes.iconButton}__icon`} />
      ) : (
        <InsertInvitationRoundedIcon
          className={`${classes.iconButton}__icon`}
        />
      )}
    </IconButton>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const { errors } = formState;
        return (
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            sx={{
              border: "1px solid red !important",
            }}
          >
            <DatePicker
              sx={{
                border: "1px solid red !important",
              }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              views={views}
              label={label}
              inputFormat={inputFormat}
              defaultCalendarMonth={minDate || null}
              value={field.value || null}
              onChange={(data) => field.onChange(data)}
              className={classes.root}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true,
                  }}
                  InputProps={{
                    endAdornment: renderEndAdornment(field),
                  }}
                  autoFocus={false}
                  onClick={(e) => setOpen(true)}
                  sx={{
                    "&:hover": {
                      outline: "none",
                      border: "0",
                    },
                    "&:focus": {
                      outline: "none",
                      border: "none",
                    },
                  }}
                  error={Boolean(errors[name])}
                  helperText={Boolean(errors[name]) && errors[name].message}
                  {...other}
                />
              )}
              minDate={minDate || null}
              maxDate={maxDate || null}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
}

export default DateTimeField;
