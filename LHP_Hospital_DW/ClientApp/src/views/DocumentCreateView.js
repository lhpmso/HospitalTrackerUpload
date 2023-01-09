import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import MaterialTable from 'material-table'

class DocumentCreateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentColumns: [
                {
                    field: "entryName",
                    title: "Form Type",
                },
                {
                    field: "description",
                    title: "Description",
                },
            ]
        };
        this.handleCreateForm = this.handleCreateForm.bind(this);
    }

    handleCreateForm(event, rowdata) {
        //console.log(rowdata);
        this.props.actions.showMemberFormEditor(rowdata.currentDictFormId)
    }

    render() {


        return (
            <React.Fragment>
                <Grid container style={{marginTop: 20}}>
                    <Grid item xs={12}>
                        <MaterialTable title="New Document"
                                       columns={this.state.documentColumns}
                                       actions={[
                                           {
                                               icon: 'add',
                                               tooltip: 'New Form',
                                               onClick: this.handleCreateForm
                                           }
                                       ]}
                                       options={{
                                           actionsColumnIndex: -1,
                                           headerStyle: {
                                               backgroundColor: '#01579b',
                                               color: '#FFF'
                                           }
                                       }}
                                       data={this.props.forms}/>

                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

DocumentCreateView.propTypes = {
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedFacility: state.app.selectedFacility,
        selectedHP: state.app.selectedHP,
        actions: state.app.healthplans,
        account: state.app.account,
        forms: state.app.dictForms,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentCreateView)