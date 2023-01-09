import {authProvider} from '../AuthProvider'
import * as types from './types'
import {url} from './URL'

export function fetchHealthPlans() {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url('healthplan/list'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_HEALTHPLANS, payload: json.payload})
        } else {
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }

}

export function fetchFacilitiesForHealthPlan(heatlthPlanID) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`healthplan/${heatlthPlanID}/facilities`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_FACILITIES, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchMembersForFacility(facilityID) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`facility/${facilityID}/members`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_MEMBERS, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}

export function fetchActiveAcuteTransfers(healthPlanID, silent = false) {
    return async dispatch => {
        if (!silent) dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`form/ActiveAcuteTransfers/${healthPlanID}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            if (!silent) dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_ACTIVE_ACUTE_TRANSFERS, payload: json.payload})
        } else {
            console.error(response);
            if (!silent) dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchSkilledServices(healthPlanID, silent = false) {
    return async dispatch => {
        if (!silent) dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`form/SkilledServices/${healthPlanID}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            if (!silent) dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_SKILLED_SERVICES, payload: json.payload})
        } else {
            console.error(response);
            if (!silent) dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchMemberForm(formID) {
    return async dispatch => {

        dispatch({type: types.SET_FORM_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`member/memberform/${formID}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_FORM_LOADING_FALSE});
            dispatch({type: types.RECEIVE_MEMBER_FORM, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_FORM_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchPreviousHospitalizations(formHeaderId) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`member/Hospitalizations/${formHeaderId}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();

            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_PREVIOUS_HOSPITALIZATIONS, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}

export function clearPreviousHospitalizations() {
    return dispatch => {
        dispatch({type: types.CLEAR_PREVIOUS_HOSPITALIZATIONS})
    }
}


export function fetchAndSetMember(memberRoleId, callback) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        console.log(memberRoleId);
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`member/${memberRoleId}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_AND_SET_CURRENT_MEMBER, payload: json.payload})
            if (callback) callback(json);
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function registerUser() {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`User/register`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.REGISTER_USER, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}

export function saveMemberForm(formData, success, failure) {
    //Modified to update member headers
    return async dispatch => {
        console.log("saving form....")
        dispatch({type: types.SET_SAVING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Form/MemberForm/save`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            let json = await response.json();
            dispatch({type: types.SET_SAVING_FALSE});
            dispatch({type: types.SAVE_MEMBER_FORM, payload: json.payload})
            if (json.statusCode === 0) {
                if (success) success(json)
            } else {
                if (failure) failure(json.errorMsg);
            }

        } else {
            console.error(response);
            if (failure) failure();
            dispatch({type: types.SET_SAVING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchDictForms() {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Form/DictFormHeader`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();
            // console.log(json);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_DICT_FORMS, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}

export function fetchMemberFormHeaders(memberId) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Form/Member/FormHeaders/${memberId}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();

            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_MEMBER_FORM_HEADERS, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function fetchDictForm(formId) {
    return async dispatch => {
        dispatch({type: types.SET_LOADING_TRUE});
        let token = await authProvider.getAccessToken();
        let response = await fetch(url(`Form/DictForm/${formId}`), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        if (response.ok) {
            let json = await response.json();

            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.RECEIVE_DICT_FORM, payload: json.payload})
        } else {
            console.error(response);
            dispatch({type: types.SET_LOADING_FALSE});
            dispatch({type: types.FETCH_ERROR, payload: response})
        }
    }
}


export function setSelectedHealthPlan(hp) {

    return (dispatch) => {
        dispatch({type: types.SET_SELECTED_HEALTHPLAN, payload: hp})
    }


}

export function setSelectedFacility(fac) {

    return (dispatch) => {
        dispatch({type: types.SET_SELECTED_FACILITY, payload: fac})
    }
}

export function setSelectedPatient(pat) {
    return (dispatch) => {
        dispatch({type: types.SET_SELECTED_PATIENT, payload: pat})
    }
}

export function setSelectedDictForm(form) {
    return (dispatch) => {
        dispatch({type: types.SET_SELECTED_DICT_FORM, payload: form})
    }
}

export function setCurrentMemberForm(form) {
    return (dispatch) => {
        dispatch({type: types.SET_CURRENT_MEMBER_FORM, payload: form})
    }
}

export function toggleAcuteModel() {
    return (dispatch) => {
        dispatch({type: types.TOGGLE_ACUTE_MODAL})
    }
}

export function toggleDictFormDialog() {
    return (dispatch) => {
        dispatch({type: types.TOGGLE_DICT_FORM_DIALOG})
    }
}


export function toggleSkilledModel() {
    return (dispatch) => {
        dispatch({type: types.TOGGLE_SKILLED_MODAL})
    }
}

export function toggleMemberSelector() {
    return (dispatch) => {
        dispatch({type: types.TOGGLE_MEMBER_SELECTOR})
    }
}


export function closeMemberSelector() {
    return (dispatch) => {
        dispatch({type: types.CLOSE_MEMBER_SELECTOR})
    }
}


export function setSideBarNav(selected) {
    return (dispatch) => {
        dispatch({type: types.SET_SIDEBAR_NAV, payload: selected})
    }
}


export function showMemberFormEditor(dictFormId, disabled) {

    return (dispatch) => {
        dispatch(fetchDictForm(dictFormId));
        dispatch({type: types.SHOW_MEMBER_FORM_EDITOR, payload: disabled})
    }
}

export function hideMemberFormEditor() {
    return (dispatch) => {
        dispatch({type: types.HIDE_MEMBER_FORM_EDITOR})
    }
}



export function showMemberFormViewer(dictFormId, disabled) {

    return (dispatch) => {
        dispatch(fetchDictForm(dictFormId));
        dispatch({type: types.SHOW_MEMBER_FORM_VIEWER, payload: disabled})
    }
}

export function hideMemberFormViewer() {
    return (dispatch) => {
        dispatch({type: types.HIDE_MEMBER_FORM_VIEWER})
    }
}

export function showMemberDirectorFormViewer(dictFormId) {

    return (dispatch) => {
        dispatch(fetchDictForm(dictFormId));
        dispatch({type: types.SHOW_MEMBER_FORM_DIRECTOR_VIEWER})
    }
}

export function hideMemberDirectorFormViewer() {
    return (dispatch) => {
        dispatch({type: types.HIDE_MEMBER_FORM_DIRECTOR_VIEWER})
    }
}

export function setCurrentFormData(formData) {

    return (dispatch) => {
        dispatch({type: types.SET_CURRENT_MEMBER_FORM_DATA, payload: formData})
    }
}
