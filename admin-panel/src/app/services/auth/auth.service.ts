import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http/base-http.service";
import { Observable } from "rxjs";
import { RegisterRequest, RegisterResponse } from "../../models/auth.model";
import { ApiResponse } from "../../models/common.model";

const BASE_URL = "http://localhost:3000";

@Injectable({
  providedIn: "root",
})
export class AuthService extends BaseHttpService {
  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.post<RegisterResponse>(`${BASE_URL}/api/auth/register`, user);
  }

  verifyEmail(token: string): Observable<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(
      `${BASE_URL}/api/auth/verify-email?token=${token}`
    );
  }

  resendVerificationEmail(email: string): Observable<ApiResponse<any>> {
    return this.post<ApiResponse<any>>(
      `${BASE_URL}/api/auth/resend-verification`,
      { email }
    );
  }

  //   // Fetch all users
  //   getUsers(): Observable<User[]> {
  //     return this.get<User[]>(BASE_URL + this.apiUrl);
  //   }

  //   // Fetch a single user by ID
  //   getUser(id: number): Observable<User> {
  //     return this.get<User>(`${BASE_URL}${this.apiUrl}/${id}`);
  //   }

  //   // Add a new user
  //   addUser(user: User): Observable<User> {
  //     return this.post<User>(BASE_URL + this.apiUrl, user);
  //   }

  //   // Update an existing user
  //   updateUser(id: number, user: User): Observable<User> {
  //     return this.put<User>(`${BASE_URL}${this.apiUrl}/${id}`, user);
  //   }

  //   // Delete an user
  //   deleteUser(id: number): Observable<User> {
  //     return this.delete<User>(`${BASE_URL}${this.apiUrl}/${id}`);
  //   }
}
