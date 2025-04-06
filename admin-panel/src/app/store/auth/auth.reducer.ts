import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/user.model";
import * as AuthActions from "./auth.actions";
import { LocalStorageService } from "../../services/storage/local-storage.service";

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const localStorageService = new LocalStorageService();
const token = localStorageService.getItem("token") as string;
const userStr = localStorageService.getItem("user");
const user = userStr ? (JSON.parse(userStr) as User) : null;

export const initialAuthState: AuthState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    token: null,
    user: null,
    isAuthenticated: false,
  })),
  on(AuthActions.setToken, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: !!token,
  })),
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
  }))
);
