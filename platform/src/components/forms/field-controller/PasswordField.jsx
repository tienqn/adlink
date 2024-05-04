import {Controller} from 'react-hook-form';
import {useState} from 'react';
import {IconButton, InputAdornment, TextField} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function PasswordField({name, label, control, ...other}) {
    const [show, setShow] = useState(false);
    return (
        <Controller
            name={name}
            control={control}
            render={({field, formState}) => {
                const {errors} = formState;
                return (
                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={show ? 'text' : 'password'}
                        label={label}
                        onChange={(data) => field.onChange(data)}
                        value={field.value}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShow(!show)} edge="end">
                                        {show ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(errors[name])}
                        helperText={Boolean(errors[name]) && errors[name].message}
                        {...other}
                    />
                );
            }}
        />
    );
}

export default PasswordField;
