import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import * as AdminActions from '../actions/AdminActions';
import DrawerView from "./DrawerView";
import FormEditor from "../components/MemberFormEditorV2";
import FormViewer from "../components/MemberFormViewer";
import DirectorFormViewer from "../components/MemberFormDirectorViewer";
import LoadingSpinner from "../components/LoadingSpinner";
import MemberSelectorDialog from "../components/MemberSelectorDialog";
import SavingSpinner from "../components/SavingSpinner";

class HomeView extends Component {
    componentDidMount() {
        this.props.user.getUserRole();
    }

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <DrawerView authProvider={this.props.authProvider}/>
                    <FormEditor/>
                    <FormViewer/>
                    <DirectorFormViewer/>
                    <LoadingSpinner/>
                    <SavingSpinner/>
                    <MemberSelectorDialog/>
                    <FormEditor/>
                </Grid>
            </Grid>
        )
    }
}

HomeView.propTypes = {
    actions: PropTypes.object,
    authProvider: PropTypes.object,
}
function mapStateToProps(state) {
    return {
        selectedFacility: state.app.selectedFacility,
        selectedHP: state.app.selectedHP,
        healthplans: state.app.healthplans,
        account: state.app.account
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
        user: bindActionCreators(AdminActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)