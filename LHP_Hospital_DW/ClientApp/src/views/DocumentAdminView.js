import Grid from '@material-ui/core/Grid';
import PropTypes, {element} from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import * as AdminActions from '../actions/AdminActions'
import MaterialTable from 'material-table'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


class DocumentAdminView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentColumns: [
                {
                    field: "entryName",
                    title: "Form Type",
                },
                {
                    field: "author", title: "Author",
                },
                {
                    field: "formStatus", title: "Document Status"
                },
                {
                    field: "createdDate", title: "Created Date",
                    render: rowData => (rowData.createdDate.split('T')[0]),
                },
                {
                    field: "modifiedDate", title: "Modified Date", defaultSort: "desc",
                    render: rowData => (rowData.modifiedDate.split('T')[0]),
                },

            ],
            dialogOpen: false, 
            formHeaderId: null,
        };
        this.onViewerClicked = this.onViewerClicked.bind(this);
        this.DeleteDialog = this.DeleteDialog.bind(this);
    }

    onViewerClicked(type, rowData) {
        if (type === "VIEW") {
            this.props.actions.fetchMemberForm(rowData.memberFormId)
            this.props.actions.showMemberFormEditor(rowData.dictFormId, true);

        } else {
            this.setState({dialogOpen: true, formHeaderId: rowData.memberFormHeaderId})
        }
    }
    DeleteDialog() {
        return (
            <Dialog
                open={this.state.dialogOpen}
                onClose={(e) => this.setState({dialogOpen: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you would like to mark this form in error?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(e) => this.setState({dialogOpen: false})} color="primary" autoFocus>
                        CANCEL
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                            console.log("Changing: ${this.state.formHeaderId}")
                            this.props.admin.changeFormStatus(this.state.formHeaderId, true, (json) => {
                                setTimeout(()=> this.props.actions.fetchMemberFormHeaders(this.props.member.memberRoleId), 1000)
                                
                            })
                            this.setState({dialogOpen: false, formHeaderId: null})
                            
                        }} color="secondary" autoFocus>
                        ENTER IN ERROR
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        return (
            <React.Fragment>
                <this.DeleteDialog/>
                <Grid container style={{marginTop: 20}}>
                    <Grid item xs={12}>
                        <MaterialTable title="Member Documents"
                                       columns={this.state.documentColumns}
                                       options={{
                                           grouping: false,
                                           sorting: true,
                                           actionsColumnIndex: -1,
                                           headerStyle: {
                                               backgroundColor: '#01579b',
                                               color: '#FFF'
                                           }

                                       }}
                                       actions={[
                                           {
                                               icon: 'delete',
                                               tooltip: 'Delete Document',
                                               onClick: (event, rowData) => {
                                                   this.onViewerClicked("DELETE", rowData);
                                               }
                                           },
                                           {
                                               icon: OpenInNewIcon,
                                               tooltip: 'View Document',
                                               onClick: (event, rowData) => {
                                                   this.onViewerClicked("VIEW", rowData);
                                               }
                                           }
                                       ]}
                                       data={this.props.formHeaders}/>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

DocumentAdminView.propTypes = {
    actions: PropTypes.object,
    admin: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedFacility: state.app.selectedFacility,
        selectedHP: state.app.selectedHP,
        healthplans: state.app.healthplans,
        account: state.app.account,
        formHeaders: state.app.memberFormHeaders,
        member: state.app.selectedMember,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
        admin: bindActionCreators(AdminActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentAdminView)