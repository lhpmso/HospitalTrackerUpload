import Grid from "@material-ui/core/Grid";
import React from "react";
import {bindActionCreators} from "redux";
import * as HPActions from "../actions/HealthPlanActions";
import {connect} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import * as types from "../actions/types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
// const Json = ({data, onChange}) => <AceEditor onChange={onChange} width="100%" theme="github" mode="json"
//                                               value={JSON.stringify(data, null, 4)}/>;


const initialState = null;

export const PreviousAdmissionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.RECEIVE_PREVIOUS_HOSPITALIZATIONS:
            return action.payload;
        case types.CLEAR_PREVIOUS_HOSPITALIZATIONS:
            return null;
        default:
            return state
    }

};


class PreviousAdmissionsWidget extends React.Component {
    constructor(props) {
        super(props);
        this.renderAdmission = this.renderAdmission.bind(this)
        this.state = {
            refreshed: false,
            memberRoleId: null
        }
    }

    componentDidMount() {


    }

    componentWillUnmount() {
        this.props.actions.clearPreviousHospitalizations()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState?.memberRoleId !== null && prevState.memberRoleId !== nextProps?.member?.memberRoleId)
        {
            nextProps.actions.fetchPreviousHospitalizations(nextProps.member.memberRoleId);
            return {...prevState, refreshed: true, memberRoleId: nextProps.member.memberRoleId}
        }
        if (nextProps?.member?.memberRoleId && prevState.refreshed === false) {
            nextProps.actions.fetchPreviousHospitalizations(nextProps.member.memberRoleId);
            return {...prevState, refreshed: true, memberRoleId: nextProps.member.memberRoleId}
        }

        let value = 'No';
        if (nextProps.previousAdmissions !== null && nextProps.formContext?.section_a?.transfer_date) {
            const transfer_date = moment.utc(nextProps.formContext?.section_a?.transfer_date).local()

            nextProps.previousAdmissions.map(a => {
                const days = transfer_date.diff(moment.utc(a.transferDate).local(), 'days', false);
                if (days <= 30 && days > 0) value = 'Yes';
            });
            if (value !== nextProps.value) nextProps.onChange(value);
        } else {
            if (value !== nextProps.value) nextProps.onChange(value);
        }
        return null
    };

    renderAdmission(form) {
        const memberFormHeaderId = this.props?.currentForm?.memberFormHeaderId
        if (memberFormHeaderId === form?.memberFormHeaderId)
            return null;
        return (<ListItem key={form.memberFormId} button>
            <ListItemText>
                {moment.utc(form.transferDate).local().format("YYYY-MM-DD hh:mm A")} - {form.transferHospital}
            </ListItemText>
        </ListItem>)
    }

    render() {
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
            form,
            previousAdmissions
        } = this.props;

        return (
            <>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <FormControl
                            fullWidth={true}
                            id={id}

                        >
                            <TextField value={value ? value : ''}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       disabled={true}
                                       autoFocus={autofocus}
                                       required={required}
                                       label={label || schema.title}
                                       onChange={onChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{padding: 10}}>Past Hospital Transfers</Typography>
                        <Paper style={{maxHeight: 200, overflow: "auto"}}>
                            {previousAdmissions ? (<List style={{paddingTop: 10}}>
                                {previousAdmissions?.map(a => {
                                        return (
                                            this.renderAdmission(a)
                                        )
                                    }
                                )}
                            </List>) : (<Typography style={{padding: 20}}>No Previous Admissions Recorded</Typography>)}
                        </Paper>
                    </Grid>
                </Grid>
            </>
        )
    }

}


function mapStateToProps(state) {
    return {
        member: state.app.selectedMember,
        selectedFacility: state.app.selectedFacility,
        hp: state.app.selectedHP,
        form: state.hospitalSelector.form,
        previousAdmissions: state.previousAdmissions,

    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HPActions, dispatch)};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(PreviousAdmissionsWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};