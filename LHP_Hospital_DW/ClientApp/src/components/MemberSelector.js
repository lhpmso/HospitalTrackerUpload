import React, {Component} from "react";
import Grid from '@material-ui/core/Grid'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import PropTypes from "prop-types";
import MaterialTable from 'material-table'
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class MemberSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberColumns: [
                {
                    field: "lastName",
                    title: "Last Name",
                },
                {
                    field: "firstName", title: "First Name",
                },
                {
                    field: "dob", title: "Date of Birth",
                },
                {
                    field: "gender", title: "Gender",
                }

            ],
            showDeceased: false,
            showNonMembers: false,
        };
        this.handleMemberSelect = this.handleMemberSelect.bind(this)
    }

    handleMemberSelect(event, rowdata) {
        this.props.actions.setSelectedPatient(rowdata);
        this.props.handleSelected(rowdata);
    }

    render() {
        let members = this.props?.members
        if (this.state.showDeceased === false)
        {
            members = members.filter((m) => m.deceased === false)
        }
        if (this.state.showNonMembers === false)
        {
            members = members.filter((m) => m.endDate <= new Date())
        }
        return (
            <Grid container style={{padding: 20}} spacing={4}>
                <Grid item xs={12}>
                    <FormGroup row>
                        <FormControlLabel
                            label="Show Deceased Members"
                            control={<Switch checked={this.state.showDeceased} onChange={() => this.setState({showDeceased: !this.state.showDeceased})}/>}
                        />
                        <FormControlLabel
                            label="Show Disenrolled Members"
                            control={<Switch checked={this.state.showNonMembers} onChange={() => this.setState({showNonMembers: !this.state.showNonMembers})}/>}
                        /> 
                        
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <MaterialTable
                        title="Members"
                        columns={this.state.memberColumns}
                        options={{
                            actionsColumnIndex: -1,
                            headerStyle: {
                                backgroundColor: '#01579b',
                                color: '#FFF'
                            }
                        }}
                        actions={[
                            {
                                icon: 'done',
                                tooltip: 'Select Member',
                                onClick: this.handleMemberSelect
                            }
                        ]}
                        data={members}/>
                </Grid>
            </Grid>
        );
    }
}

MemberSelector.propTypes = {
    actions: PropTypes.object,
    handleSelected: PropTypes.func
};

function mapStateToProps(state) {
    return {
        members: state.app.members,
        patient: state.app.selectedMember,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberSelector)