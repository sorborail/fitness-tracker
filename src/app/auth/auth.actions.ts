import {Action} from '@ngrx/store';

export const SET_AUTH = '[Auth] Set Auth';
export const SET_NOT_AUTH = '[Auth] Set Not Auth';

export class SetAuth implements Action {
  readonly type: string = SET_AUTH;
}

export class SetNotAuth implements Action {
  readonly type: string = SET_NOT_AUTH;
}

export type AuthActions = SetAuth | SetNotAuth;
