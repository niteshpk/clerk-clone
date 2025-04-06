import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http/base-http.service";
import { Observable } from "rxjs";
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "../../models/auth.model";
import { ApiResponse } from "../../models/common.model";
import { environment } from "../../../environments/environment";

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class AuthService extends BaseHttpService {
  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.post<RegisterResponse>(`${BASE_URL}/api/auth/register`, user);
  }

  verifyEmail(token: string, email: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(
      `${BASE_URL}/api/auth/verify-email?token=${token}&email=${email}`
    );
  }

  resendVerificationEmail(email: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/resend-verification`,
      { email }
    );
  }

  login(user: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>(`${BASE_URL}/api/auth/login`, user);
  }

  logout(): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`${BASE_URL}/api/auth/logout`, {});
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(`${BASE_URL}/api/auth/forgot-password`, {
      email,
    });
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/reset-password`,
      request
    );
  }
}
