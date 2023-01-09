import Grid from '@material-ui/core/Grid';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from '../actions/HealthPlanActions';
import * as FormActions from '../actions/FormActions';
import MaterialTable, {MTableToolbar} from 'material-table'
import HealthPlanSelector from "../components/HealthPlanSelector";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import * as NavTypes from "../actions/NavTypes"
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SkilledServicesTable from "../components/SkilledServicesTable";
import moment from "moment";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import {showMemberDirectorFormViewer} from "../actions/HealthPlanActions";
class MainView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.exportCsv = this.exportCsv.bind(this);
        this.refresh = this.refresh.bind(this)

    }

    onViewerClicked(type, rowData) {
        switch (type) {
            case 'DIRECTOR':
                this.props.actions.fetchMemberForm(rowData.memberFormId);
                this.props.actions.showMemberDirectorFormViewer(rowData.dictFormId);
                break;
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

        alert("This feature is disabled. It will be added in an upcoming release.")

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

        const transferOutcomes = this.props.transfers ? this.props.transfers.map(item => item.memberTransferOutcome).filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const facilities = this.props.transfers ? this.props.transfers.map(item => item.facilityName).filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const hospitals = this.props.transfers ? this.props.transfers.map(item => item.transferHospital ? item.transferHospital : 'Pending').filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const lastNames = this.props.transfers ? this.props.transfers.map(item => item.memberLastName + ', ' + item.memberFirstName).filter((v, i, a) => a.indexOf(v) === i).sort() : [];
        const documentColumns = [
            {
                field: "transferDate", title: "Transfer Date",
                filtering: false, defaultSort: 'desc',
                render: rowData => {
                    return moment.utc(rowData.transferDate).local().format("YYYY-MM-DD hh:mm A")
                }
            },
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
                field: "transferHospital", title: "Hospital",
                lookup: hospitals,
                render: rowData => rowData.transferHospital ? rowData.transferHospital : 'Pending',
                customSort: (a, b) => a.transferHospital ? a.transferHospital.localeCompare(b.transferHospital ? b.transferHospital : 'Pending') : 0,
                customFilterAndSearch: (term, rowData) => {
                    if (typeof term === 'string') {
                        return this.searchField(term, rowData.transferHospital)
                    }
                    if (term.length === 0) return true;
                    let v = term.map(item => {
                        return hospitals[item];
                    });
                    return v.includes(rowData.transferHospital ? rowData.transferHospital : 'Pending')
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
                field: 'memberTransferOutcome',
                title: 'Transfer Outcome',
                lookup: transferOutcomes,
                render: rowData => rowData.memberTransferOutcome,
                customSort: (a, b) => a.memberTransferOutcome.localeCompare(b.memberTransferOutcome),
                customFilterAndSearch: (term, rowData) => {
                    if (typeof term === 'string') {
                        return this.searchField(term, rowData.memberTransferOutcome)
                    }
                    if (term.length === 0) return true;
                    let v = term.map(item => {
                        return transferOutcomes[item];
                    });
                    return v.includes(rowData.memberTransferOutcome)
                }
            },
            {
                field: "dischargeDate", title: "Discharge Date",
                render: rowData => (rowData.dischargeDate ? rowData.dischargeDate.split('T')[0] : "N/A"),
                lookup: {'Discharged': 'Discharged', 'Not Discharged': 'Not Discharged'},
                customFilterAndSearch: (term, rowData) => {
                    if (typeof term === 'string') {
                        return this.searchField(term, rowData.dischargeDate)
                    }
                    if (term.length === 0) return true;
                    if (term.includes('Discharged')) {
                        return rowData.dischargeDate !== null
                    }
                    if (term.includes('Not Discharged')) {
                        return rowData.dischargeDate === null
                    }
                }
            },
            {
                field: "status", title: "Form Status",
                render: rowData => (rowData.status ? rowData.status : "N/A"),
                lookup: {'Draft': 'Draft', 'Finalized': 'Finalized'},
                customFilterAndSearch: (term, rowData) => {
                    console.log(term)
                    console.log(rowData.status)
                    if (term.includes(rowData.status)) {
                        return rowData
                    }
                }
            }
        ];


        return (
            <React.Fragment>
                <Grid container style={{marginTop: 10}} spacing={4}>
                    <Grid item xs={12}>
                        <Paper style={{padding: 20}}>
                            <HealthPlanSelector/>
                        </Paper>
                        {/*<Button onClick={this.refresh}> refresh</Button>*/}
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            title={this.props.selectedHP ? `Hospital Transfers by Market ${this.props.selectedHP.entryName}` : 'Hospital Transfers by Market'}
                            columns={documentColumns}
                            components={{
                                Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <Tooltip style={{marginLeft: 10}} title="Refresh Transfer List">
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
                                },
                                {
                                    icon: LocalHospitalIcon,
                                    tooltip: 'Medical Director View',
                                    onClick: (event, rowData) => {
                                        this.onViewerClicked("DIRECTOR", rowData);
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
                            data={this.props.transfers}
                            detailPanel={rowData => {
                                return (
                                    <Paper style={{margin: 25, background: "rgba(174, 204, 233)"}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Authorized By
                                                    </TableCell>
                                                    <TableCell>
                                                        Family Notified
                                                    </TableCell>
                                                    <TableCell>
                                                        Member Enrollment Date
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        {rowData.whoAuthorized == 'Other' ? rowData.whoAuthorizedOther : rowData.whoAuthorized}
                                                    </TableCell>
                                                    <TableCell>
                                                        {rowData.familyNotified}
                                                    </TableCell>
                                                    <TableCell>
                                                        {rowData.memberStartDate.split('T')[0]}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <Grid container style={{marginRight: 25, padding: 20}}>
                                            <Paper>
                                                <Typography variant='h5' style={{margin: 10}}>
                                                    Change in Condition
                                                </Typography>
                                                <Typography style={{margin: 10}}>
                                                    {rowData.changeInConditionDescription}
                                                </Typography>
                                            </Paper>
                                        </Grid>

                                    </Paper>
                                )
                            }}/>
                    </Grid>
                    <Grid item xs={12}>
                        <SkilledServicesTable/>
                    </Grid>

                </Grid>
            </React.Fragment>
        )
    }

    getTransferOutcomes() {
        return this.props.transfers ? new Set(this.props.transfers.map(item => item.memberTransferOutcome)) : [];

    }
}

MainView.propTypes = {
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedHP: state.app.selectedHealthPlan,
        account: state.app.account,
        formHeaders: state.app.memberFormHeaders,
        transfers: state.app.activeAcuteTransfers,
        sideBarNav: state.app.sideBarNav,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
        formActions: bindActionCreators(FormActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView)