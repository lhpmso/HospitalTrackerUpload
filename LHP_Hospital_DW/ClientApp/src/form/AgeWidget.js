import React from 'react';
import {connect} from "react-redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import {format} from "date-fns";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

class AgeWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    componentDidMount() {
        const dob = this.props?.member?.dob;
        const transferDate = this.props?.formContext?.section_a?.transfer_date;

        // console.log(dob);
        if (dob && transferDate) {
            const years = moment(transferDate).diff(dob, 'years', false);
            if (years !== this.props.value) this.props.onChange(years);
            // console.log(years)
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const dob = nextProps?.member?.dob;
        const transferDate = nextProps?.formContext?.section_a?.transfer_date;
        // console.log(dob);
        // console.log(transferDate);
        if (dob && transferDate) {
            const years = moment(transferDate).diff(dob, 'years', false);
            if (years !== nextProps.value) nextProps.onChange(years);
            // console.log(years)
        }
        return null
    }

    render() {

        const {
            id,
            required,
            //readonly,
            //disabled,
            value,
            label,
            onFocus,
            onBlur,
            onChange,
            options,
            autofocus,
            schema,
        } = this.props;

        return (
            <>
                <FormControl
                    fullWidth={true}
                    //error={!!rawErrors}
                    required={required}>
                    <Grid container>
                        <Grid item xs={11}>
                            <TextField
                                fullWidth={true}
                                id={id}
                                label={label || schema.title}
                                autoFocus={autofocus}
                                required={required}
                                disabled={true}
                                value={value ? value : ''}
                                //format="yyyy-MM-dd"
                                //clearable={true}
                                onChange={v => {
                                    if (v) {
                                        onChange(value === '' || null ? options.emptyValue : format(v, 'yyyy-MM-dd'));

                                    } else {
                                        onChange(options.emptyValue)
                                    }
                                }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </FormControl>
            </>)

    }

}

function mapStateToProps(state) {
    return {
        member: state.app.selectedMember,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(AgeWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};
