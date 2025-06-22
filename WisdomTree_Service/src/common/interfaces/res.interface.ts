interface ApiResponse<T = any> {
  status: number;
  code: number;
  message: string;
  data?: T;
}

interface ApiResponseSuccess {
  status: number;
  code: number;
  message: string;
}

export { ApiResponse, ApiResponseSuccess };
