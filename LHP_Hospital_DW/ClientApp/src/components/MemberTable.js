import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as HealthPlanActions from '../actions/HealthPlanActions';
import {bindActionCreators} from "redux";
import { withStyles, makeStyles } from '@material-ui/core/styles';


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
        
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.primary.light,
        },
    },
}))(TableRow);

class MemberTable extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        if (this.props.member) {

            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead >
                            <StyledTableRow>
                                <StyledTableCell>Member Name: {this.props.member ? this.props.member.lastName + ', ' + this.props.member.firstName : ''}</StyledTableCell>
                                <StyledTableCell>Facility: {this.props.facility ? this.props.facility.entryName : ''}</StyledTableCell>
                                <StyledTableCell>Date of Birth: {this.props.member ? this.props.member.dob.split('T')[0] : ''}</StyledTableCell>
                                <StyledTableCell>Gender: {this.props.member ? this.props.member.gender : ''}</StyledTableCell>
                                <StyledTableCell>Enrollment Date: {this.props.member.startDate ? this.props.member.startDate.split('T')[0] : ''}</StyledTableCell>
                                <StyledTableCell>Assigned NP: {this.props.member.nursePractioner ? this.props.member.nursePractioner : ''}</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {/*<TableBody>*/}
                        {/*    <StyledTableRow>*/}
                        {/*        <StyledTableCell>{this.props.member ? this.props.member.lastName + ', ' + this.props.member.firstName : ''}</StyledTableCell>*/}
                        {/*        <StyledTableCell>{this.props.facility ? this.props.facility.entryName : ''}</StyledTableCell>*/}
                        {/*        <StyledTableCell>{this.props.member ? this.props.member.dob.split('T')[0] : ''}</StyledTableCell>*/}
                        {/*        <StyledTableCell >{this.props.member ? this.props.member.gender : ''}</StyledTableCell>*/}
                        {/*        <StyledTableCell >{this.props.member.startDate ? this.props.member.startDate.split('T')[0] : ''}</StyledTableCell>*/}
                        {/*        <StyledTableCell >{this.props.member.nursePractioner ? this.props.member.nursePractioner : ''}</StyledTableCell>*/}
                        {/*    </StyledTableRow>*/}
                        {/*</TableBody>*/}
                    </Table>
                </TableContainer>
            )
        }
        return (
            <div/>
        )
    }
}

MemberTable.propTypes = {
    open: PropTypes.bool,
};


function mapStateToProps(state) {
    return {
        show: state.app.showMemberSelector,
        member: state.app.selectedMember,
        facility: state.app.selectedFacility,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

const ReduxWrapped = connect(mapStateToProps,mapDispatchToProps)(MemberTable);

export default (props) => {
    return (
        <ReduxWrapped {...props} />
    )
};
