import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
} from 'class-validator';

// 前端提交数据DTO

// 用户注册
class UsersCreateDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @IsOptional()
  @ValidateIf((o) => o.avatar !== '') // 只有当avatar不为空字符串时，才执行后续验证
  @IsString()
  @IsUrl({}, { message: '头像 URL 格式不正确' })
  avatar?: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '电话号码格式不正确' })
  phone: string;

  @IsNotEmpty({ message: 'code不能为空' })
  @IsString()
  code: string;
}

// 用户登录
class UserLoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

// 修改个人信息
class UpdateInfoDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '头像不能为空' })
  @IsString()
  @IsUrl({}, { message: '头像 URL 格式不正确' })
  avatar: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '电话号码格式不正确' })
  phone: string;
}

export { UsersCreateDto, UserLoginDto, UpdateInfoDto };
