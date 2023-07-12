import { SET_LOGIN, SET_LOGOUT } from "../actions/AuthActions";

const initState = {
  loggedIn: false,
  user: {},
}

const AuthReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        loggedIn: true,
        user: action.payload
      }
    case SET_LOGOUT:
      return {
        ...state,
        loggedIn: false,
        user: {}
      }

    default:
      return state
  }
}

export default AuthReducer;