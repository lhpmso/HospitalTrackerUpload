import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {utils} from '@rjsf/core';
import OutlinedInput from "@material-ui/core/OutlinedInput";

const {asNumber, guessType} = utils;

const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema, value) => {
    // "enum" is a reserved word, so only "type" and "items" can be destructured
    const {type, items} = schema;
    if (value === '') {
        return undefined;
    } else if (type === 'array' && items && nums.has(items.type)) {
        return value.map(asNumber);
    } else if (type === 'boolean') {
        return value === 'true';
    } else if (type === 'number') {
        return asNumber(value);
    }

    // If type is undefined, but an enum is present, try and infer the type from
    // the enum values
    if (schema.enum) {
        if (schema.enum.every((x) => guessType(x) === 'number')) {
            return asNumber(value);
        } else if (schema.enum.every((x) => guessType(x) === 'boolean')) {
            return value === 'true';
        }
    }

    return value;
};

const SelectWidget = ({
                          schema,
                          id,
                          options,
                          label,
                          required,
                          disabled,
                          readonly,
                          value,
                          multiple,
                          autofocus,
                          onChange,
                          onBlur,
                          onFocus,
                      }) => {
    const {enumOptions, enumDisabled} = options;

    const emptyValue = multiple ? [] : '';

    const _onChange = ({
                           target: {value},
                       }) =>
        onChange(processValue(schema, value));
    const _onBlur = ({target: {value}}) =>
        onBlur(id, processValue(schema, value));
    const _onFocus = ({
                          target: {value},
                      }) =>
        onFocus(id, processValue(schema, value));

    return (
        <FormControl
            variant="outlined"
            fullWidth={true}
            //error={!!rawErrors}
            required={required}>
            <InputLabel htmlFor={id}>
                {label || schema.title}
            </InputLabel>

            <Select
                //label={<OutlinedInput label={label || schema.title}/>}
                //label={label || schema.title}
                id={id}
                inputProps={{
                    id: id,
                }}
                multiple={typeof multiple === 'undefined' ? false : multiple}
                value={typeof value === 'undefined' ? emptyValue : value}
                required={required}
                disabled={disabled || readonly}
                autoFocus={autofocus}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
                //variant={'outlined'}
            >
                {enumOptions.map(({ value, label }, i) => {
                    const disabled =
                        enumDisabled && enumDisabled.indexOf(value) !== -1;
                    return (
                        <MenuItem key={i} value={value} disabled={disabled}>
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default SelectWidget;