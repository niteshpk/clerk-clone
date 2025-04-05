interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

export type ApiError = {
  code: string;
  message: string;
};

export interface ApiResponseSuccess<T> extends APIResponse<T> {
  success: true;
}

export interface ApiResponseError<T> extends APIResponse<T> {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError<T>;
