import React from 'react';
import {connect} from "react-redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import moment from "moment";


class HealthPlanWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}


    }

    componentDidMount() {
        const healthPlan = this.props?.healthPlan?.entryName;
        const value = this.props?.value;
        if (healthPlan) {
            if (healthPlan !== value) this.props.onChange(healthPlan);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const healthPlan = nextProps?.healthPlan?.entryName;
        const value = nextProps?.value;
        // console.log(healthPlan);
        // console.log(value);
        // console.log(nextProps.healthPlan)
        if (healthPlan) {
            if (healthPlan != value) nextProps.onChange(healthPlan);
        }
        return null
    }

    render() {
        const healthPlan = this.props?.healthPlan?.entryName;
        const {
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
        } = this.props;


        return (
            <>
                <FormControl
                    fullWidth={true}
                    //error={!!rawErrors}
                    required={required}>

                    <TextField
                        fullWidth={true}
                        id={id}
                        label={label || schema.title}
                        autoFocus={autofocus}
                        required={required}
                        disabled={true}
                        value={value ? value : ''}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />


                </FormControl>
            </>)

    }

}

function mapStateToProps(state) {
    return {
        healthPlan: state.app.selectedHealthPlan,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(HealthPlanWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};
