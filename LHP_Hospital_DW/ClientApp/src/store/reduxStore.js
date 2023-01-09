import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {AuthenticationActions, AuthenticationState} from 'react-aad-msal';
import * as types from '../actions/types'
import thunk from 'redux-thunk';
import {connectRouter, routerMiddleware} from 'connected-react-router'
import {createBrowserHistory} from 'history'
import {NAV_MAIN} from "../actions/NavTypes";
import {HospitalSelectorReducer} from "../form/HospitalSelectorWidget";
import {PreviousAdmissionsReducer} from "../form/PreviousAdmissionsWidget";
import {AdminReduxStore} from "./AdminReduxStore";

const initialState = {
    initializing: false,
    initialized: false,
    idToken: null,
    accessToken: null,
    state: AuthenticationState.Unauthenticated,
    healthplans: [],
    facilities: [],
    showAcuteModal: true,
    showSkilledModal: false,
    loading: false,
    showMemberFormEditor: false,
    showMemberFormViewer: false,
    showMemberFormDirectorViewer: false,
    showMemberSelector: false,
    members: [],
    sideBarNav: 'NAV_MAIN',
    showDictFormDialog: false,
    saving: false,
    userRole: {admin: false},
};




export const history = createBrowserHistory();

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case AuthenticationActions.Initializing:
            return {
                ...state,
                initializing: true,
                initialized: false,
            };
        case AuthenticationActions.Initialized:
            return {
                ...state,
                initializing: false,
                initialized: true,
            };
        case AuthenticationActions.AcquiredIdTokenSuccess:
            return {
                ...state,
                idToken: action.payload,
            };
        case AuthenticationActions.AcquiredAccessTokenSuccess:
            return {
                ...state,
                accessToken: action.payload,
            };
        case AuthenticationActions.AcquiredAccessTokenError:
            return {
                ...state,
                accessToken: null,
            };
        case AuthenticationActions.LoginSuccess:
            return {
                ...state,
                account: action.payload.account,
            };
        case AuthenticationActions.LoginError:
        case AuthenticationActions.AcquiredIdTokenError:
        case AuthenticationActions.LogoutSuccess:
            return {...state, idToken: null, accessToken: null, account: null};
        case AuthenticationActions.AuthenticatedStateChanged:
            return {
                ...state,
                state: action.payload,
            };
        case types.SET_LOADING_TRUE:
            return {...state, loading: true};
        case types.SET_LOADING_FALSE:
            return {...state, loading: false};
        
            case types.SET_FORM_LOADING_TRUE:
            return {...state, formLoading: true};
        case types.SET_FORM_LOADING_FALSE:
            return {...state, formLoading: false};
            
        case types.SET_SAVING_TRUE:
            return {...state, saving: true};
        case types.SET_SAVING_FALSE:
            return {...state, saving: false};

        case types.TOGGLE_DICT_FORM_DIALOG:
            return {...state, showDictFormDialog: !state.showDictFormDialog};
        case types.TOGGLE_ACUTE_MODAL:
            return {...state, showAcuteModal: !state.showAcuteModal};
        case types.TOGGLE_SKILLED_MODAL:
            return {...state, showSkilledModal: !state.showSkilledModal};
        case types.TOGGLE_MEMBER_SELECTOR:
            return {...state, showMemberSelector: !state.showMemberSelector};

        case types.CLOSE_MEMBER_SELECTOR:
            return {...state, showMemberSelector: false, sideBarNav: NAV_MAIN};

        case types.RECEIVE_ACTIVE_ACUTE_TRANSFERS:
            return {...state, activeAcuteTransfers: action.payload};
        case types.RECEIVE_SKILLED_SERVICES:
            return {...state, skilledServices: action.payload};  
            
        case types.RECEIVE_MEMBER_FORM_HEADERS:
            return {...state, memberFormHeaders: action.payload};
        case types.RECEIVE_FACILITIES:
            return {...state, facilities: action.payload};
        case types.RECEIVE_HEALTHPLANS:
            return {...state, healthplans: action.payload};
        case types.RECEIVE_DICT_FORMS:
            return {...state, dictForms: action.payload};
        case types.RECEIVE_DICT_FORM:
            return {...state, dictForm: action.payload};
        case types.RECEIVE_MEMBERS:
            return {...state, members: action.payload};
        case types.SET_SIDEBAR_NAV:
            return {...state, sideBarNav: action.payload};


        case types.SET_SELECTED_HEALTHPLAN:
            return {
                ...state,
                selectedHealthPlan: action.payload,
                selectedFacility: null,
                selectedMember: null,
                members: []
            };
        case types.SET_SELECTED_DICT_FORM:
            return {...state, selectedDictForm: action.payload};
        case types.SET_SELECTED_FACILITY:
            return {...state, selectedFacility: action.payload, selectedMember: null, members: []};
        case types.SET_SELECTED_PATIENT:
            return {...state, selectedMember: action.payload};
        case types.RECEIVE_AND_SET_CURRENT_MEMBER:
            return {
                ...state,
                //selectedFacility: action.payload.facility,
                selectedMember: action.payload.member,
                selectedHealthPlan: action.payload.healthplan,
            };
        case types.SET_CURRENT_MEMBER_FORM:
            return {...state, currentMemberForm: action.payload};
        case types.RECEIVE_MEMBER_FORM:
            return {
                ...state, selectedFacility: action.payload.facility,
                selectedMember: action.payload.member,
                selectedHealthPlan: action.payload.healthplan,
                currentMemberForm: action.payload.form
            };
        case types.SET_CURRENT_MEMBER_FORM_DATA:
            if (state.currentMemberForm) {
                return {
                    ...state, currentMemberForm:
                        {
                            ...state.currentMemberForm,
                            formData: action.payload
                        }
                };
            } else {
                return state
            }
        case types.REGISTER_USER:
            return {...state, userRegistered: true};
        // case types.SAVE_MEMBER_FORM:
        //     if (state.showMemberFormEditor) {
        //         return {...state, currentMemberForm: action.payload}
        //     } else {
        //         return {...state}
        //     }


        case types.SHOW_MEMBER_FORM_EDITOR:
            return {...state, showMemberFormEditor: true, formEditorDisabled: action.payload};
        case types.HIDE_MEMBER_FORM_EDITOR:
            return {...state, currentMemberForm: null, dictForm: null, showMemberFormEditor: false};

        case types.SHOW_MEMBER_FORM_VIEWER:
            return {...state, showMemberFormViewer: true};
        case types.HIDE_MEMBER_FORM_VIEWER:
            return {...state, currentMemberForm: null, dictForm: null, showMemberFormViewer: false};
        
        case types.SHOW_MEMBER_FORM_DIRECTOR_VIEWER:
            return {...state, showMemberFormDirectorViewer: true};
        case types.HIDE_MEMBER_FORM_DIRECTOR_VIEWER:
            return {...state, currentMemberForm: null, dictForm: null, showMemberFormDirectorViewer: false};


        // case types.FETCH_FACILITY_BY_NPI:
        //     let form = Object.assign({}, state.formFacilities ? state.formFacilities : {});
        //
        //     let npi = action.payload.entryCode ? action.payload.entryCode : null;
        //     if (npi != null)
        //     {
        //         form.facilities = form.facilities ? form.facilities : {};
        //         form.facilities[npi] = action.payload;
        //     }
        //     return {...state, form: form};
        // case types.SEARCH_FACILITY_BY_NAME:
        //    
        //     return {...state, searchResults: action.payload};

        default:
            return state;
    }
};
 

const middleware = [thunk, routerMiddleware(history)];
const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            name: 'MyApp', actionsBlacklist: ['REDUX_STORAGE_SAVE']
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
);


export const basicReduxStore = createStore(
    combineReducers({app: appReducer, router: connectRouter(history), hospitalSelector: HospitalSelectorReducer, previousAdmissions: PreviousAdmissionsReducer, admin: AdminReduxStore}),
    enhancer,
);