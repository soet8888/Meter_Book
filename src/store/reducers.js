import { LoginActionTypes } from './actionTypes'

const userState = {
    status: 'none'
}

export function userReducer(state = userState, action) {
    switch (action.type) {
        case LoginActionTypes.LOGGED_IN:
            return Object.assign({}, state, {
                status: 'LOGGED_IN',
                user: action.user
            });
        case LoginActionTypes.LOGGED_LOGOUT:
            return Object.assign({}, state, {
                status: "none"
            });
        default:
            return state
    }
}
