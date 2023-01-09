import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from "@material-ui/core/CircularProgress";

class LoadingSpinner extends React.Component {

    render() {
        return (
            <Dialog style={{zIndex: 1400}}  open={this.props.show}>
                <DialogTitle>Retrieving Form ... </DialogTitle>
                <CircularProgress style={{margin: "auto", marginBottom: "20px"}}/>
            </Dialog>
        )
    }
}

LoadingSpinner.propTypes = {
    open: PropTypes.bool,
}


function mapStateToProps(state) {
    return {
        show: state.app.formLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingSpinner)