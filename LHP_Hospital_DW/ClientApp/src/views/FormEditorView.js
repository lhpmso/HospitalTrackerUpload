import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from "prop-types";
import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import AcuteTransferEditor from '../components/AcuteTransferEditor';
import AcuteTransfers from '../components/AcuteTransfers';
import FacilitySelector from '../components/FacilitySelector';
import HealthPlanSelector from '../components/HealthPlanSelector';
import SkilledServiceEditor from '../components/SkilledServiceEditor';



class FormEditorView extends Component {


    render() {

        return (
            <Grid container>
                <Grid item xs={12}>
                    <AppBar>
                        <Toolbar>
                            <Grid justify="space-between"
                                alignItems="center"
                                container>
                                <Grid item>
                                    <Typography variant="h6" color="inherit" noWrap>
                                        Longevity Health Plan - Acute Hospital Transfers
                                </Typography>
                                </Grid>
                                <Grid>
                                    <Button>
                                        {this.props.account ? this.props.account.name : "Logging in"}
                                    </Button>
                                </Grid>
                            </Grid>

                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item xs={12}>
                    <Grid container style={{ marginTop: 80 }} spacing={4}>
                        <Grid style={{ flexGrow: 1, padding: 20 }} spacing={5} container>
                            <Grid item xs={12} lg={6}>
                                <HealthPlanSelector />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FacilitySelector />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <AcuteTransfers toggleEditor={this.toggleEditor} />
                                <AcuteTransferEditor/>
                                <SkilledServiceEditor/>
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        )

    }
}

FormEditorView.propTypes = {
    actions: PropTypes.object,
}
function mapStateToProps(state) {
    return {
        selectedFacility: state.selectedFacility,
        selectedHP: state.selectedHP,
        healthplans: state.healthplans,
        account: state.account
    };
}

function mapDispatchToProps(dispatch) {
    return {
        HPActions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormEditorView)