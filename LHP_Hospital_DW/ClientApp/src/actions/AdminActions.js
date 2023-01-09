import {authProvider} from '../AuthProvider'
import * as types from './types'
import {url} from './URL'
import {AdminActions} from "../store/AdminReduxStore";
import {Call} from "@material-ui/icons";



export function getUserRole() {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`admin/admin`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json)
            dispatch({ type: AdminActions.FETCH_USER_ROLE, payload: json.payload })
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}



export function getTransfers() {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`admin/admin/transfers`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json)
            dispatch({ type: AdminActions.FETCH_TRANSFERS, payload: json.payload })
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}

export function changeFormStatus(memberFormHeaderId, status, callback) {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`admin/admin/form/${memberFormHeaderId}/${status}`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            if (callback) callback(json)
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}

export function getTransferFacilities(page, limit, callback) {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Facility/get?` + new URLSearchParams({limit: limit, page: page})), {
            
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            if (callback) callback(json)
            dispatch({ type: AdminActions.FETCH_TRANSFER_FACILITIES, payload: json.payload })
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}

export function createTransferFacility(npi, callback) {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Facility/create/${npi}`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
            if (callback) callback(json)
            dispatch({ type: AdminActions.CREATE_TRANSFER_FACILITY, payload: json.payload })
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}