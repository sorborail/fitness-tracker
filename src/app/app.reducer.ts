import * as UIReducer from './shared/ui.reducer';
import * as AuthReducer from './auth/auth.reducer';
import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';

export interface State {
  ui: UIReducer.State;
  auth: AuthReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: UIReducer.uiReducer,
  auth: AuthReducer.authReducer
};

export const getUiState = createFeatureSelector<UIReducer.State>('ui');
export const getIsLoading = createSelector(getUiState, UIReducer.getIsLoading);

export const getAuthState = createFeatureSelector<AuthReducer.State>('auth');
export const getIsAuth = createSelector(getAuthState, AuthReducer.getIsAuth);
