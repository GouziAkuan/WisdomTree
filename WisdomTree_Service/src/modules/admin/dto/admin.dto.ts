import { IsNotEmpty, IsString } from 'class-validator';

// 管理员注册
class AdminCreateDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: '角色不能为空' })
  @IsString()
  role: string;
}

// 管理员登录
class AdminLoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

export { AdminLoginDto, AdminCreateDto };
