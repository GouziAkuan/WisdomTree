import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class AdminGetAdoptDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  AdoptID: number;
}

class AdminPutAdoptDetailDto {
  // 每条领养记录的ID
  @IsNotEmpty()
  @IsNumber()
  AdoptID: number;

  // 领养账号
  @IsNotEmpty()
  @IsString()
  username: string;

  // 领养的编号
  @IsNotEmpty()
  @IsString()
  adoption_id: string;

  // 树木学名
  @IsNotEmpty()
  @IsString()
  scientific_name: string;

  // 树木类型
  @IsString()
  tree_type: string;

  // 领养人昵称
  @IsString()
  nickname: string;

  // 领养人希望
  @IsString()
  wish: string;
}

// 删除领养
class AdminDeleteDto extends AdminGetAdoptDto {}

export { AdminGetAdoptDto, AdminPutAdoptDetailDto, AdminDeleteDto };
