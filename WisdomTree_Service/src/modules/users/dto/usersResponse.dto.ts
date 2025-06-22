// 后端响应DTO

// 用户注册
interface UserCreateResponseDto {
  status: number;
  code: number;
  message: string;
}

// 用户登录
interface UserLoginResponseDto {
  status: number;
  code: number;
  message: string;
  data?: {
    username: string;
    avatar: string;
    phone: string;
    accessToken: string;
    refreshToken: string;
  };
}

// 查询用户信息
interface UserInfoResponseDto {
  status: number;
  code: number;
  message: string;
  data: {
    username: string;
    avatar: string;
    phone: string;
    energy: number;
    activityCount: number;
    collectCount: number;
    adoptionsCount: number;
  };
}

interface UpdateInfoResponseDto {
  status: number;
  code: number;
  message: string;
}

export {
  UserCreateResponseDto,
  UserLoginResponseDto,
  UserInfoResponseDto,
  UpdateInfoResponseDto,
};
