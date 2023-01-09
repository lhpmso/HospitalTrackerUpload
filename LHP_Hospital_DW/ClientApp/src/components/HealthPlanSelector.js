import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';


const healthPlanSelector = (props) => {
    
};

class HealthPlanSelector extends Component {
    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this)
    }
    handleSelection(e) {
        let hp = e.target.value;
        let selected = this.props.healthplans.find((i) => i.dictHealthPlanId == hp);
        this.props.HPActions.setSelectedHealthPlan(selected);
        this.props.HPActions.fetchFacilitiesForHealthPlan(selected.dictHealthPlanId);
        this.props.HPActions.fetchActiveAcuteTransfers(selected.dictHealthPlanId);
        this.props.HPActions.fetchSkilledServices(selected.dictHealthPlanId);
    }

    componentWillMount() {
        this.props.HPActions.fetchHealthPlans()
    }

    render() {
        return (
            <FormControl fullWidth>
                <FormLabel color="primary">Select Health Plan</FormLabel>
                <Select
                    onChange={this.handleSelection}
                    fullWidth
                    variant="outlined"
                    value={this.props.selectedHP ? this.props.selectedHP.dictHealthPlanId : 0}>   
                    {this.props.healthplans.map((m) => {
                        return (
                            <MenuItem key={m.dictHealthPlanId} value={m.dictHealthPlanId}>{m.entryName}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }
}


HealthPlanSelector.propTypes = {
    HPActions: PropTypes.object,
};
function mapStateToProps(state) {
    return {
        selectedHP: state.app.selectedHealthPlan,
        healthplans: state.app.healthplans,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        HPActions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HealthPlanSelector)