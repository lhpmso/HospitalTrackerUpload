import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


const TextareaWidget = ({
                            id,
                            placeholder,
                            value,
                            required,
                            disabled,
                            autofocus,
                            label,
                            readonly,
                            onBlur,
                            onFocus,
                            onChange,
                            options,
                            schema,
                        }) => {
    const _onChange = ({
                           target: {value},
                       }) =>
        onChange(value === '' ? options.emptyValue : value);
    const _onBlur = ({target: {value}}) =>
        onBlur(id, value);
    const _onFocus = ({
                          target: {value},
                      }) => onFocus(id, value);

    return (
        <FormControl
            fullWidth={true}
            //error={!!rawErrors}
            required={required}
        >
            <TextField
                id={id}
                label={label || schema.title}
                placeholder={placeholder}
                disabled={disabled || readonly}
                InputLabelProps={{
                    shrink: true,
                }}
                value={value}
                required={required}
                autoFocus={autofocus}
                multiline={true}
                rows={options.rows || 5}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
            />
        </FormControl>
    );
};

export default TextareaWidget;