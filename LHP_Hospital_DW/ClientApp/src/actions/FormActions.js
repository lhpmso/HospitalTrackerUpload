import {authProvider} from '../AuthProvider'
import * as types from './types'
import {url} from './URL'



export function fetchFacilityByNpi(npi) {
    return async dispatch => {
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`form/Hospital/npi/${npi}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({ type: types.FETCH_FACILITY_BY_NPI, payload: json.payload })
        } else {
            console.error(response);
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}


export function searchForFacility(search) {
    return async dispatch => {
        //dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`form/Hospital/search/${search}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            //dispatch({type: types.SET_LOADING_FALSE});
            dispatch({ type: types.SEARCH_FACILITY_BY_NAME, payload: json.payload })
        } else {
            console.error(response);
            //dispatch({type: types.SET_LOADING_FALSE});
            dispatch({ type: types.FETCH_ERROR, payload: response })
        }
    }
}

export function clearSearchResults() {
    return (dispatch) => dispatch({type: types.CLEAR_FACILITY_SEARCH_RESULTS})
}
