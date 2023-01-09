import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from "@material-ui/core/CircularProgress";

class SavingSpinner extends React.Component {

    render() {
        return (
            <Dialog style={{zIndex: 1401}} open={this.props.show}>
                <DialogTitle>Saving Please Wait...</DialogTitle>
                <CircularProgress style={{margin: "auto", marginBottom: "20px"}}/>
            </Dialog>
        )
    }
}

SavingSpinner.propTypes = {
    open: PropTypes.bool,
}


function mapStateToProps(state) {
    return {
        show: state.app.saving,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SavingSpinner)