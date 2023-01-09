import PropTypes from "prop-types";
import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as AdminActions from "../actions/AdminActions"
import {Tab, Tabs} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import LoadingSpinner from "../components/LoadingSpinner";
import DeleteFormView from "./DeleteFormView";
import AddTransferFacilityView from "./AddTransferFacilityView";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const AdminView = (props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <LoadingSpinner/>
            <Grid>
                <Grid item xs={12} className={classes.root}>
                    
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Delete Forms" {...a11yProps(0)} />
                            <Tab label="Add Transfer Facility" {...a11yProps(1)} />

                        </Tabs>
                    
                </Grid>
                <Grid item>
                    <TabPanel value={value} index={0}>
                        <DeleteFormView props={props}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                       <AddTransferFacilityView props={props}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                </Grid>
            </Grid>
        </Grid>
    )

}

AdminView.propTypes = {
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
        actions: bindActionCreators(AdminActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminView)