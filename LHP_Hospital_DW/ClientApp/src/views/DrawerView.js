import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from "../actions/HealthPlanActions";
import * as NavTypes from "../actions/NavTypes"
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import MemberTable from "../components/MemberTable";
import DocumentView from "./DocumentView";
import DocumentCreateView from "./DocumentCreateView";
import MainView from "./MainView";
import SettingsIcon from '@material-ui/icons/Settings';
import AdminView from "./AdminView";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        //background: "#303f9f",
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function DrawerView(props) {
    const {container, authProvider} = props;

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const renderMain = () => {
        switch (props.sideBarNav) {
            case NavTypes.NAV_MAIN:
                return (
                    <MainView/>
                );
            case NavTypes.NAV_DOCUMENT:
                if (!props.member && !props.showMemberSelector) {
                    props.actions.toggleMemberSelector();
                }

                props.actions.fetchDictForms();

                return (
                    <DocumentCreateView/>
                );
            case NavTypes.NAV_MEMBER_CHART:
                if (!props.member && !props.showMemberSelector) {
                    props.actions.toggleMemberSelector()
                }
                if (props.member) {
                    props.actions.fetchMemberFormHeaders(props.member.memberRoleId)
                }
                return (
                    <DocumentView/>
                )
            case NavTypes.NAV_ADMIN:
                return (
                    <AdminView/>
                )
        }
    };
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar}/>
            <Divider/>
            <List>
                <ListItem button selected={props.sideBarNav === NavTypes.NAV_MAIN ? true : false}
                          onClick={() => props.actions.setSideBarNav(NavTypes.NAV_MAIN)}>
                    <ListItemIcon><HomeIcon/></ListItemIcon>
                    <ListItemText primary="Home"/>
                </ListItem>
                <Divider/>
                <ListItem button selected={props.sideBarNav === NavTypes.NAV_DOCUMENT ? true : false}
                          onClick={() => props.actions.setSideBarNav(NavTypes.NAV_DOCUMENT)}>
                    <ListItemIcon><EditIcon/></ListItemIcon>
                    <ListItemText primary="Create Document" secondary="Create a document about a member."/>
                </ListItem>
                <Divider/>
                <ListItem button selected={props.sideBarNav === NavTypes.NAV_MEMBER_CHART ? true : false}
                          onClick={() => props.actions.setSideBarNav(NavTypes.NAV_MEMBER_CHART)}>
                    <ListItemIcon><AssignmentIndIcon/></ListItemIcon>
                    <ListItemText primary="View Documents" secondary="View Documents about a member."/>
                </ListItem>
                <Divider/>
                {props.admin ? (
                    <div>
                        
                        <ListItem button selected={props.sideBarNav === NavTypes.NAV_ADMIN ? true : false}
                                  onClick={() => props.actions.setSideBarNav(NavTypes.NAV_ADMIN)}>
                            <ListItemIcon><SettingsIcon/></ListItemIcon>
                            <ListItemText primary="Admin" secondary="System Administration Settings"/>
                        </ListItem>
                        <Divider/>
                    </div>
                    ) : null}

            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Grid justify="space-between"
                          alignItems="center"
                          container>
                        <Grid item>
                            <Typography variant="h6" color="inherit" noWrap>
                                Longevity Health Plan
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button color="secondary"
                                    variant="contained"
                                    startIcon={<SearchIcon/>}
                                    onClick={() => props.actions.toggleMemberSelector()}>
                                Search Member
                            </Button>
                        </Grid>
                        <Grid>
                            <Button onClick={() => authProvider.logout()}>
                                {props.account ? props.account.name : "Logging in"}
                            </Button>
                        </Grid>
                    </Grid>

                </Toolbar>

            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer

                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <Grid container style={{marginTop: 50}}>
                    <Grid item xs={12}>
                        <MemberTable/>
                    </Grid>


                </Grid>
                {renderMain()}


            </main>
        </div>
    );
}

DrawerView.propTypes = {
    container: PropTypes.any,
    actions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        selectedHP: state.app.selectedHealthPlan,
        account: state.app.account,
        sideBarNav: state.app.sideBarNav,
        member: state.app.selectedMember,
        showMemberSelector: state.app.showMemberSelector,
        showDictFormDialog: state.app.showDictFormDialog,
        admin: state.admin.userRole.admin,
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(HealthPlanActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerView)
