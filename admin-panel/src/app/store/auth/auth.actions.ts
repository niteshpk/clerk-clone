import { createAction, props } from "@ngrx/store";
import { User } from "@models/user.model";

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{ token: string; user: User }>()
);

export const logout = createAction("[Auth] Logout");

export const logoutSuccess = createAction("[Auth] Logout Success");

export const setToken = createAction(
  "[Auth] Set Token",
  props<{ token: string }>()
);

export const setUser = createAction("[Auth] Set User", props<{ user: User }>());

export const initAuth = createAction("[Auth] Init Auth");
