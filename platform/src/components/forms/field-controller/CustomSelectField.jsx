import React, {useState} from 'react';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import {Controller} from 'react-hook-form';
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Chip} from "@mui/material";

const filter = createFilterOptions();

/*
* Doc for custom select fields
* Props:
* - control , name , label, options , isMultiple, isCreatable, optionKey, optionValue
* - defaultValue is a object have same type with options's items, which must have optionKey, optionValue
* - isMultiple: use for one or multiple choosing (default:false)
* - isCreatable: use for freeSolo mode (add item not existing in options) (default:false)
* Usage:
* - Select field (isMultiple: false, isCreatable: false)
* - Select multi field (isMultiple: true, isCreatable: false)
* - Select field with freeSolo (isMultiple: false, isCreatable: true)
* - Select multi field with freeSolo (isMultiple: true, isCreatable: true)
* */

const SelectField = ({
                         control,
                         name,
                         label,
                         options,
                         isMultiple = false,
                         isCreatable = false,
                         optionKey,
                         optionValue,
                         disabled=false,
                         disabledValues=[],
                         ...other
                     }) => {

    const [open, toggleOpen] = useState(false);
    const [value, setValue] = useState("");
    const handleClose = () => {
        setValue("")
        toggleOpen(false);
    };

    return (
        // <FormControl>
        <Controller
            name={name}
            control={control}
            defaultValue={(isMultiple ? [] : null)}
            render={({field, fieldState}) => {
                return <FormControl fullWidth {...other}>
                    <Autocomplete
                        {...field}
                        {...other}
                        disabled={disabled}
                        multiple={isMultiple}
                        onChange={(event, newValue) => {

                            if (!isMultiple) {
                                if (typeof newValue === "string") {
                                    // timeout to avoid instant validation of the dialog's form.
                                    setTimeout(() => {
                                        toggleOpen(true);
                                        setValue(newValue)
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    toggleOpen(true);
                                    setValue(newValue.inputValue)
                                } else {
                                    field.onChange(newValue);
                                }
                            } else {
                                if (Array.isArray(newValue)) {
                                    const newItem = newValue[newValue.length - 1];
                                    // Check if the array contains input values (objects with 'inputValue' property)
                                    if (typeof newItem === "string") {
                                        // timeout to avoid instant validation of the dialog's form.
                                        setTimeout(() => {
                                            toggleOpen(true);
                                            setValue(newValue)
                                        });
                                    } else if (newItem && newItem.inputValue) {
                                        toggleOpen(true);
                                        setValue(newItem.inputValue)
                                    } else {
                                        // console.log("asdfasdf");
                                        // let newValue = newValue
                                        field.onChange(newValue);
                                    }
                                }
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            if (!isCreatable) return filtered;
                            // Suggest the creation of a new value
                            const {inputValue} = params;
                            const isExisting = options.some((option) => inputValue === option[optionKey]);
                            if (inputValue !== "" && !isExisting) {
                                filtered.push({
                                    inputValue: inputValue,
                                    [optionValue]: `Add "${inputValue}"`,
                                });
                            }
                            return filtered;
                        }}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === "string") {
                                const findOption = options.filter((item) => item[optionKey] === option);
                                if (findOption.length) return findOption[0][optionValue];
                                return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option[optionValue];
                        }}
                        getOptionDisabled={(option) => {
                            if (isMultiple) return field.value.map((item) => item[optionKey]).includes(option[optionKey])
                        }}
                        renderOption={(props, option) => <li {...props}>{option[optionValue]}</li>}
                        renderTags={(value, getTagProps) => {
                            return value.map((option, index) => {
                                return (
                                    <Chip
                                        variant="outlined"
                                        label={option[`${optionKey}`] || option}
                                        color="primary"
                                        {...getTagProps({index})}
                                        disabled={disabledValues.includes(option[`${optionKey}`])}
                                    />
                                );
                            })
                        }
                        }
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        options={options}
                        renderInput={(params) => (
                            <TextField {...params} label={label}/>
                        )}
                    />
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add a new field</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Did you miss any item in our list? Please, add it!
                            </DialogContentText>
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="name"
                                value={value}
                                onChange={(event) =>
                                    setValue(event.target.value)
                                }
                                // label="title"
                                type="text"
                                variant="standard"
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => {
                                if (!isMultiple) {
                                    field.onChange({
                                        [optionKey]: value,
                                        [optionValue]: value,
                                    })
                                    handleClose()
                                } else {
                                    const submitValue = [...field.value, {
                                        [optionKey]: value,
                                        [optionValue]: value,
                                    }]
                                    field.onChange(submitValue)
                                    handleClose()
                                }
                            }}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </FormControl>
            }
            }
        />
        // </FormControl>
    );
};


export default SelectField;
