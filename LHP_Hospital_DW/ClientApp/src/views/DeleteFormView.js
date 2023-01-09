import PropTypes from "prop-types";
import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as AdminActions from "../actions/AdminActions"
import Grid from "@material-ui/core/Grid";
import DocumentAdminView from "./DocumentAdminView";


const DeleteFormView = (props) => {

    return (
        <>
            <Grid>
                <Grid item xs={12}>
                    <DocumentAdminView/>
                </Grid>
            </Grid>
        </>
    )

}

DeleteFormView.propTypes = {
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        transfers: state.admin.transfers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFormView)