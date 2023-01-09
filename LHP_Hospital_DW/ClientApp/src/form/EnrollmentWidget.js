import React from 'react';
import {connect} from "react-redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import {format} from "date-fns";
import TextField from "@material-ui/core/TextField";


class EnrollmentWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const enrollmentDate = this.props?.member?.startDate;
        if (enrollmentDate) {
            if (enrollmentDate !== this.props.value) this.props.onChange(enrollmentDate.split('T')[0]);
        }
    }

    render() {

        const {
            id,
            required,
            // readonly,
            // disabled,
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

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(EnrollmentWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};
