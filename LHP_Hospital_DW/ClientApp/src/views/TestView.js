import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import FormEditor from '../components/FormEditor';
import MemberSelectorDialog from "../components/MemberSelectorDialog";

class Home extends Component {
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
                    <Grid container style={{marginTop: 80}} spacing={4}>
                        <Grid style={{flexGrow: 1, padding: 20}} spacing={5} container>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <FormEditor/>
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>
                <MemberSelectorDialog/>
            </Grid>
        )

    }
}

Home.propTypes = {
    actions: PropTypes.object,
};

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
        HPActions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)