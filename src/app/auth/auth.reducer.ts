import {AuthActions, SET_AUTH, SET_NOT_AUTH} from './auth.actions';

export interface State {
  isAuth: boolean;
}

const initialState: State = {
  isAuth: false
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTH:
      return {isAuth: true};
    case SET_NOT_AUTH:
      return {isAuth: false};
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuth;
