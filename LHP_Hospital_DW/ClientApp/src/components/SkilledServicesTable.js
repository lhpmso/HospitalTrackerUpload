import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import MaterialTable, {MTableToolbar} from 'material-table'
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import * as NavTypes from "../actions/NavTypes"
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

class SkilledServicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.exportCsv = this.exportCsv.bind(this);
        this.refresh = this.refresh.bind(this)

    }

    onViewerClicked(type, rowData) {
        switch (type) {
            case 'VIEW':
                this.props.actions.fetchMemberForm(rowData.memberFormId);
                this.props.actions.showMemberFormViewer(rowData.dictFormId, true);
                break;
            case 'EDIT':
                this.props.actions.fetchMemberForm(rowData.memberFormId);
                this.props.actions.showMemberFormEditor(rowData.dictFormId, false);
                break;
            case 'SELECT':
                this.props.actions.fetchAndSetMember(rowData.memberRoleId, () => this.props.actions.setSideBarNav(NavTypes.NAV_MEMBER_CHART));
                break;
            default:
                break;
        }
    }
    

    exportCsv(columns, data) {
        // console.log(columns);
        // console.log(data);
        // const rows = this.props.transfers.map(r => r.values);
        // const builder = new CsvBuilder('hospital_transfer_by_market.csv');
        // console.log(rows);
        alert("This feature is disabled. It will be added in an upcoming release.")
        // builder
        //     .setDelimeter(',')
        //     .setColumns(columns.map(columnDef => columnDef.title))
        //     .addRows(rows)
        //     .exportFile();
    };

    refresh() {
        if (this.props.selectedHP && this.props.sideBarNav === NavTypes.NAV_MAIN) {
            this.props.actions.fetchActiveAcuteTransfers(this.props.selectedHP.dictHealthPlanId, true)
        }
    }

    searchField(term, field) {
        if ((typeof term === 'string') && (typeof field === 'string')) {
            return field.toLowerCase().includes(term.toLowerCase());
        }
    }

    intervalID;

    componentDidMount() {
        if (this.intervalID == null) {
            this.intervalID = setInterval(this.refresh, 300000);
        }
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.interval);
    }


    render() {
        const facilities = this.props.skilledServices ? this.props.skilledServices.map(item => item.facilityName).filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const lastNames = this.props.skilledServices ? this.props.skilledServices.map(item => item.memberLastName + ', ' + item.memberFirstName).filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const documentColumns = [
            {

                title: "Member Name",
                lookup: lastNames,
                render: rowData => rowData.memberLastName + ', ' + rowData.memberFirstName,
                customSort: (a, b) => a.memberLastName.localeCompare(b.memberLastName),
                customFilterAndSearch: (term, rowData) => {
                    if (typeof term === 'string') {
                        return this.searchField(term, rowData.memberFirstName) || this.searchField(term, rowData.memberLastName)
                    }
                    if (term.length === 0) return true;
                    let v = term.map(item => {
                        return lastNames[item];
                    });
                    return v.includes(rowData.memberLastName + ', ' + rowData.memberFirstName)
                }

            },
            {
                field: "facilityName", title: "Facility",
                lookup: facilities,
                render: rowData => rowData.facilityName,
                customSort: (a, b) => a.facilityName.localeCompare(b.facilityName),
                customFilterAndSearch: (term, rowData) => {
                    if (typeof term === 'string') {
                        return this.searchField(term, rowData.facilityName)
                    }
                    if (term.length === 0) return true;
                    let v = term.map(item => {
                        return facilities[item];
                    });
                    return v.includes(rowData.facilityName)
                }
            },
            {
                field: "serviceStartDate", title: "Service Start Date",
                filtering: false, defaultSort: 'desc'
            },
            {
                field: "serviceEndDate", title: "Service End Date",
                filtering: false,
            },
            {
                field: "serviceReviewDate", title: "Service Review Date",
                filtering: false,
            },
            {
                field: "status", title: "Form Status",
                render: rowData => (rowData.status ? rowData.status: "N/A"),
                lookup: {'Draft': 'Draft', 'Finalized': 'Finalized'},
                customFilterAndSearch: (term, rowData) => {
                    console.log(term)
                    console.log(rowData.status)
                    if (term.includes(rowData.status)) {
                        return rowData
                    }
                }
            },
        ];


        return (
            <React.Fragment>
                        <MaterialTable
                            title={this.props.selectedHP ? `Skilled Services by Market ${this.props.selectedHP.entryName}` : 'Skilled Services by Market'}
                            columns={documentColumns}
                            components={{
                                Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <Tooltip style={{marginLeft: 10}} title="Refresh Skilled Services">
                                            <IconButton onClick={this.refresh}>
                                                <RefreshIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                ),
                            }}
                            actions={[
                                {
                                    icon: AssignmentIndIcon,
                                    tooltip: "Select Member",
                                    onClick: (event, rowData) => {
                                        this.onViewerClicked("SELECT", rowData);
                                    }
                                },
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
                            options={{
                                actionsColumnIndex: -1,
                                search: true,
                                exportAllData: true,
                                exportButton: true,
                                filtering: true,
                                grouping: false,
                                exportCsv: this.exportCsv,
                            }}
                            data={this.props.skilledServices}/>
            </React.Fragment>
        )
    }
}

SkilledServicesTable.propTypes = {
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedHP: state.app.selectedHealthPlan,
        account: state.app.account,
        sideBarNav: state.app.sideBarNav,
        skilledServices: state.app.skilledServices,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkilledServicesTable)