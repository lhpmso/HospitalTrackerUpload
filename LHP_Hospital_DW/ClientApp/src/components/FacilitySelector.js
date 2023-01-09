import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
class FacilitySelector extends Component {
    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this)
    }

    handleSelection(e) {
        let id = e.target.value;
        let selected = this.props.facilities.find((i) => i.dictFacilityId == id)
        this.props.HPActions.setSelectedFacility(selected)
        this.props.HPActions.fetchMembersForFacility(selected.dictFacilityId)
    }


    render() {

        return (
            <FormControl fullWidth>
                <FormLabel color="primary">Select Facility</FormLabel>
                <Select
                    onChange={this.handleSelection}
                    fullWidth
                    variant="outlined"
                    placeholder="Select Facility"
                    value={this.props.selectedFacility ? this.props.selectedFacility.dictFacilityId : 0}>
                    {this.props.facilities.map((m) => {
                        return (
                            <MenuItem key={m.dictFacilityId} value={m.dictFacilityId}>{m.entryName}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>

        )
    }

}

FacilitySelector.propTypes = {
    HPActions: PropTypes.object,
}
function mapStateToProps(state) {
    return {
        selectedHP: state.app.selectedHealthPlan,
        healthplans: state.app.healthplans,
        facilities: state.app.facilities,
        selectedFacility: state.app.selectedFacility
    };
}

function mapDispatchToProps(dispatch) {
    return {
        HPActions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FacilitySelector)

