import { User } from "./user.model";
import { ApiResponse } from "./common.model";

export type RegisterResponseData = {
  user: User;
};

export type RegisterResponse = ApiResponse<RegisterResponseData>;

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export interface RegisterForm extends RegisterRequest {
  rememberMe: boolean;
}

export interface RegisterError {
  success: false;
  message: string;
  error: {
    code: string;
  };
  timestamp: string;
  requestId: string;
}
