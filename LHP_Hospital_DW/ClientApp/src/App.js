import React from "react";
import {AuthenticationState, AzureAD} from 'react-aad-msal';
import {authProvider} from "./AuthProvider";
import {basicReduxStore, history} from './store/reduxStore';
import HomeView from "./views/HomeView";
import TestView from "./views/TestView";
import {Route, Switch, useParams, Redirect} from 'react-router' // react-router v4/v5
import {ConnectedRouter} from 'connected-react-router'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as HealthPlanActions from "./actions/HealthPlanActions";
import {connect} from "react-redux";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import UnauthorizedView from "./views/UnauthorizedView";
import * as NavTypes from "./actions/NavTypes"
import './App.scss';

const theme = createMuiTheme(
    {
        "palette": {
            "background": {
                "paper": "white",
                "default": "rgba(209, 229, 255, 0.5)"
            },
            "common": {
                "black": "#000",
                "white": "#fff"
            },
            "error": {
                "contrastText": "#fff",
                "dark": "#d32f2f",
                "light": "#e57373",
                "main": "#f44336"
            },
            "primary": {
                "contrastText": "#fff",
                "dark": "#303f9f",
                "light": "#7986cb",
                "main": "#3f51b5"
            },
            "secondary": {
                "contrastText": "rgba(255, 255, 255, 1)",
                "dark": "rgba(74, 144, 226, 1)",
                "light": "rgba(74, 144, 226, 0.54)",
                "main": "rgba(74, 144, 226, 1)"
            },
            "text": {
                "disabled": "rgba(0, 0, 0, 0.38)",
                "hint": "rgba(0, 0, 0, 0.38)",
                "primary": "rgba(0, 0, 0, 0.87)",
                "secondary": "rgba(0, 0, 0, 0.54)"
            }
        },
        props: {
            MuiTextField: {
                variant: "outlined"
            },
        },
        overrides: {
            MuiInputLabel: {
                outlined: {
                    backgroundColor: 'WHITE',
                    paddingLeft: 2,
                    paddingRight: 2
                }
            }
        }
    }
);

function MemberRedirect({actions}) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
    actions.fetchAndSetMember(id, () =>{
        actions.setSideBarNav(NavTypes.NAV_MEMBER_CHART);
    });
    //actions.setSideBarNav(NavTypes.NAV_MEMBER_CHART);
    return (
        <Redirect to="/"/>
    );
}

//const Json = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.registerUser = this.registerUser.bind(this);
    }

    componentDidMount() {
        //this.props.authProvider.getAccessToken()
    }

    registerUser() {
        if (this.props.authenticationState === AuthenticationState.Authenticated && !this.props.registered) {
            this.props.actions.registerUser()
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <ConnectedRouter history={history}>
                    <AzureAD provider={authProvider} forceLogin={true} reduxStore={basicReduxStore}>

                        {
                            ({login, logout, authenticationState, error, accountInfo}) => {
                                switch (authenticationState) {
                                    case AuthenticationState.Authenticated:
                                        //this.registerUser()
                                        return (

                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Switch>
                                                    <Route exact path="/"
                                                           render={() => (<HomeView authProvider={authProvider}/>)}/>
                                                    <Route exact path="/test"
                                                           render={() => (<TestView authProvider={authProvider}/>)}/>
                                                    <Route exact path="/member/:id"
                                                    render={() => <MemberRedirect actions={this.props.actions}/>}/>

                                                    <Route render={() => (<div>Miss</div>)}/>
                                                </Switch>

                                            </MuiPickersUtilsProvider>

                                        );
                                    case AuthenticationState.Unauthenticated:
                                        return (
                                            <UnauthorizedView authProvider={authProvider}/>
                                        );
                                    case AuthenticationState.InProgress:
                                        return (<p>Authenticating...</p>);
                                }
                            }
                        }


                    </AzureAD>
                </ConnectedRouter>
            </ThemeProvider>
        )
    }
}


App.propTypes = {
    actions: PropTypes.object,
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        authenticationState: state.app.state,
        registered: state.app.userRegistered,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(HealthPlanActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
