import { Injectable } from "@angular/core";
import { BaseHttpService } from "@services/base-http/base-http.service";
import { Observable, BehaviorSubject, tap } from "rxjs";
import {
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  LoginResponse,
} from "@models/auth.model";
import { ApiResponse } from "@models/common.model";
import { environment } from "@environments/environment";
import { LocalStorageService } from "@services/local-storage/local-storage.service";
import { map } from "rxjs/operators";
import { User } from "@models/user.model";

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private userSubject = new BehaviorSubject<User | null>(null);

  token$ = this.tokenSubject.asObservable();
  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.token$.pipe(map((token) => !!token));

  constructor(
    private http: BaseHttpService,
    private localStorageService: LocalStorageService
  ) {
    // Initialize from localStorage
    const token = this.localStorageService.getItem("token");
    const user = this.localStorageService.getItem("user");
    if (token) {
      this.tokenSubject.next(token);
    }
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${BASE_URL}/api/auth/register`,
      user
    );
  }

  verifyEmail(token: string, email: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${BASE_URL}/api/auth/verify-email?token=${token}&email=${email}`
    );
  }

  resendVerificationEmail(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/resend-verification`,
      { email }
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${BASE_URL}/api/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.data.token);
          this.setUser(response.data.user);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${BASE_URL}/api/auth/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/forgot-password`,
      {
        email,
      }
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/reset-password`,
      request
    );
  }

  setToken(token: string): void {
    this.tokenSubject.next(token);
    this.localStorageService.setItem("token", token);
  }

  setUser(user: User): void {
    this.userSubject.next(user);
    this.localStorageService.setItem("user", JSON.stringify(user));
  }

  clearAuth(): void {
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.localStorageService.removeItem("token");
    this.localStorageService.removeItem("user");
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
