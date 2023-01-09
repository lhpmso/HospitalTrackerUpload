import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import FacilitySelector from "./FacilitySelector";
import HealthPlanSelector from "./HealthPlanSelector";
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import MemberSelector from "./MemberSelector";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const styles = {
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '90vh',
    },
    selector: {
        padding: 10,
    },
};

class MemberSelectorDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelected = this.handleSelected.bind(this);
        this.renderMembers = this.renderMembers.bind(this);
    }

    renderMembers() {
        if (this.props.members.length > 0) {
            return (
                <Grid item xs={12}>
                    <MemberSelector handleSelected={this.handleSelected}/>
                </Grid>
            )
        } else {
            return (
                <Grid item xs={12}>
                </Grid>
            )
        }
    }

    handleSelected(member) {
        this.props.actions.toggleMemberSelector();
    }

    render() {
        return (
            <Dialog
                classes={{paper: this.props.classes.dialogPaper}}
                open={this.props.show} fullWidth maxWidth="xl">
                <DialogTitle>
                    <Grid justify="space-between"
                          alignItems="center"
                          container>
                        <Grid item>
                            Member Selector
                        </Grid>
                        <Grid item>
                            <IconButton>
                                <CloseIcon onClick={() => this.props.actions.closeMemberSelector()}/>
                            </IconButton>
                        </Grid>
                    </Grid>


                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} r>

                        <Grid item xs={12} lg={6}>
                            <HealthPlanSelector/>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FacilitySelector/>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <MemberSelector handleSelected={this.handleSelected}/>
                            </Paper>
                        </Grid>


                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

MemberSelectorDialog.propTypes = {
    open: PropTypes.bool,
};


function mapStateToProps(state) {
    return {
        show: state.app.showMemberSelector,
        members: state.app.members,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MemberSelectorDialog))