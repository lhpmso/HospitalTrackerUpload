import Grid from "@material-ui/core/Grid";
import React from "react";
import {connect} from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import jp from "jsonpath"
import {bindActionCreators} from "redux";
import * as HealthPlanActions from "../actions/HealthPlanActions";
import {Checkbox, FormControlLabel, MenuItem, Select} from "@material-ui/core";

class OpportunitiesWidget extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {
            id,
            required,
            readonly,
            disabled,
            label,
            onFocus,
            onBlur,
            onChange,
            options,
            autofocus,
            schema,
            query,
            value,
        } = this.props;
        //{"opportunity":{"opportunity":"Delay in care from ancillary services (lab, radiology, pharmacy)"},"action":{"action":["Facility Level Education"]},"owner":"Nurse Practitioner"}
        let someValues = jp.query(this.props?.formContext, "$.section_c.additional_opportunities")[0]
        let data = value ? JSON.parse(value) : []
        if (!value) {
            this.props.onChange(JSON.stringify(someValues))
        }
        else 
        {
            if (someValues && someValues.length > data.length)
            {
                data = someValues
            }
        }
        
        //console.log("Value: " + value)
        let v = value ? data : null
        return (
            <div>
                {v &&
                v.map((opportunity, index) =>
                    (
                        <Grid container style={{paddingBottom: 20}}>
                            <Grid item xs={6}>
                                <FormControl
                                    fullWidth={true}
                                    id={id}
                                    disabled={disabled || readonly}
                                >
                                    <TextField value={opportunity?.opportunity?.opportunity}
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                               disabled={true}
                                               autoFocus={autofocus}
                                               required={required}
                                               onClick={() => this.setState({open: true})}
                                               label={"Opportunity"}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid xs={5}>
                                <FormControl>
                                    <Select
                                        variant={"outlined"}
                                        style={{width: 500, height: 52}}
                                        id={id}
                                        value={opportunity.follow_up ? opportunity.follow_up : "select_follow_up"}
                                        onChange={(e) => {
                                            let newValue = JSON.parse(JSON.stringify(v[index]))
                                            console.log(e.target.value)
                                            console.log(v[index])
                                            newValue.follow_up = e.target.value
                                            v[index] = newValue
                                            console.log(v[index])
                                            onChange(JSON.stringify(v))
                                        }}
                                    >
                                        <MenuItem value={"select_follow_up"}>Select Follow up</MenuItem>
                                        <MenuItem value={"required_follow_up"}>Required Follow Up</MenuItem>
                                        <MenuItem value={"director_follow_up"}>Needs Director Level
                                            Involvement</MenuItem>
                                        <MenuItem value={"other_follow_up"}>Other Follow ups</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={1}>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={opportunity.complete ? opportunity.complete : false}
                                                onChange={(e) => {
                                                    let newValue = v[index]
                                                    console.log(e.target.checked)
                                                    newValue.complete = e.target.checked
                                                    console.log(newValue)
                                                    console.log(index)
                                                    v[index].complete = e.target.checked
                                                    onChange(JSON.stringify(v))
                                                }}
                                            />
                                        }
                                        label="Complete?"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>)
                )}

            </div>

        )
    }

}

// ValueViewerWidget.propTypes = {
//     open: PropTypes.bool,
// };


function mapStateToProps(state) {
    return {
        //data: state.app.currentMemberForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch),};
}

const ReduxWrapped = connect(mapStateToProps, mapDispatchToProps)(OpportunitiesWidget);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};