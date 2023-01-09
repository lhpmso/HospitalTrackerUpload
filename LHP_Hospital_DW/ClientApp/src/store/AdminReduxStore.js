const AdminInitialState = {
    userRole: {admin: false}
}

export const AdminActions = {
    FETCH_USER_ROLE: 'FETCH_USER_ROLE',
    FETCH_TRANSFERS: 'FETCH_TRANSFERS',
    FETCH_TRANSFER_FACILITIES: 'FETCH_TRANSFER_FACILITIES',
    CREATE_TRANSFER_FACILITY: 'CREATE_TRANSFER_FACILITY',
    
}

export const AdminReduxStore = (state = AdminInitialState, action) => {
    switch (action.type) {
        case AdminActions.FETCH_USER_ROLE:
            return {...state, userRole: action.payload}
        case AdminActions.FETCH_TRANSFER_FACILITIES:
            return {...state, transferFacilities: action.payload}
        case AdminActions.FETCH_TRANSFERS:
            return {...state, transfers: action.payload}
        default:
            return state;
                
    }
}
    