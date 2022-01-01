import { LoginActionTypes } from "./actionTypes";

const { LOGGED_IN, LOGGED_LOGOUT } = LoginActionTypes;
export const LoginActions = {
    loggedIn: (user) => {
        return { type: LOGGED_IN, user };
    },
    logOut: () => {
        return { type: LOGGED_LOGOUT }
    }

}