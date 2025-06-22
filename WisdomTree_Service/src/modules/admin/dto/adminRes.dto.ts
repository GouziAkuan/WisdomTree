// 用户注册
interface AdminCreateResDto {
  status: number;
  code: number;
  message: string;
}

// 用户登录
interface AdminLoginResDto {
  status: number;
  code: number;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export { AdminLoginResDto, AdminCreateResDto };
