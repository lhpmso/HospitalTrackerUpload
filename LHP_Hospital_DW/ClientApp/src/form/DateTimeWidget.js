import React from 'react';
import {format} from 'date-fns'
import FormControl from '@material-ui/core/FormControl';
import {DatePicker, DateTimePicker,} from '@material-ui/pickers';
import moment from "moment";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export function pad(num, size) {
    let s = String(num);
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}


export function utcToLocal(jsonDate) {
    if (!jsonDate) {
        return null;
    }
    return new Date(jsonDate);
}

export function parseDate(d) {
    if (!d) {
        return null;
    }
    let date = moment(d, 'yyyy-MM-dd').toDate();
    return date


}

export function localToUTC(dateString) {
    if (dateString) {
        return new Date(dateString).toJSON();
    }
}


export const DateWidget = ({
                               id,
                               required,
                               readonly,
                               disabled,
                               value,
                               label,
                               onFocus,
                               onBlur,
                               onChange,
                               options,
                               autofocus,
                               schema,
                           }) => {
    const _onBlur = ({target: {value}}) =>
        onBlur(id, value);
    const _onFocus = ({
                          target: {value},
                      }) => onFocus(id, value);
    const _value = value ? value.replace(/-/g, '/') : null;
    
    return (
        <FormControl
            fullWidth={true}
            //error={!!rawErrors}
            required={required}>
            <Grid container>
                <Grid item xs={11}>
                    <DatePicker
                        fullWidth={true}
                        id={id}
                        label={label || schema.title}
                        autoFocus={autofocus}
                        required={required}
                        disabled={disabled || readonly}
                        value={_value ? _value : null}
                        format="yyyy-MM-dd"
                        //clearable={true}
                        onChange={v => {
                            if (v) {
                                onChange(value === '' || null ? options.emptyValue : format(v, 'yyyy-MM-dd'));
                                
                            } else {
                                onChange(options.emptyValue)
                            }
                        }}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button color={"secondary"} style={{marginLeft: 5, marginTop: 10}} variant={"contained"}
                            disabled={disabled || readonly}
                            onClick={e => onChange(options.emptyValue)}>Clear</Button>
                </Grid>

            </Grid>

        </FormControl>
    );
};


export const DateTimeWidget = ({
                                   id,
                                   required,
                                   readonly,
                                   disabled,
                                   value,
                                   label,
                                   onFocus,
                                   onBlur,
                                   onChange,
                                   options,
                                   autofocus,
                                   schema,
                               }) => {

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
            <DateTimePicker
                id={id}
                clearable={true}
                //variant='inline'
                label={label || schema.title}
                autoFocus={autofocus}
                required={required}
                disabled={disabled || readonly}
                //type="datetime-local"
                value={value ? utcToLocal(value) : null}
                onChange={(value) => {
                    if (value) {
                        onChange(value === '' || null ? options.emptyValue : localToUTC(value));

                    } else {
                        onChange(options.emptyValue)
                    }
                    //onChange(value === '' || null ? options.emptyValue : localToUTC(value))
                }}

                onFocus={_onFocus}
                onBlur={_onBlur}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </FormControl>
    );
};