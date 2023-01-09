import Grid from '@material-ui/core/Grid';
import PropTypes, {element} from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import MaterialTable from 'material-table'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

class DocumentView extends Component {
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

            ]
        };
        this.onViewerClicked = this.onViewerClicked.bind(this);
    }

    onViewerClicked(type, rowData) {
        console.log(type);
        console.log(rowData);
        if (type === "VIEW") {
            this.props.actions.fetchMemberForm(rowData.memberFormId)
            this.props.actions.showMemberFormViewer(rowData.dictFormId, true);

        } else {
            this.props.actions.fetchMemberForm(rowData.memberFormId)
            this.props.actions.showMemberFormEditor(rowData.dictFormId, false);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={12}>
                        <MaterialTable title="Member Documents"
                                       columns={this.state.documentColumns}
                                       options={{
                                           grouping: true,
                                           sorting: true,
                                           actionsColumnIndex: -1,
                                           headerStyle: {
                                               backgroundColor: '#01579b',
                                               color: '#FFF'
                                           }

                                       }}
                                       actions={[
                                           {
                                               icon: 'edit',
                                               tooltip: 'Edit Document',
                                               onClick: (event, rowData) => {
                                                   this.onViewerClicked("EDIT", rowData);
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

DocumentView.propTypes = {
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedFacility: state.app.selectedFacility,
        selectedHP: state.app.selectedHP,
        healthplans: state.app.healthplans,
        account: state.app.account,
        formHeaders: state.app.memberFormHeaders,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)