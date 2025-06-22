import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// 管理员添加树种类信息
class AdminAddTreeTypeDto {
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  scientific_name: string;

  @IsString()
  common_name: string;

  @IsString()
  description: string;

  @IsNumber()
  total: number;

  @IsNumber()
  energy: number;
}

// 管理员获取树种类信息
class AdminGetTreeTypeInfoDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  treeTypeID: number; // 树ID
}

// 管理员修改树种类信息
class AdminUpdateTreeTypeDto extends AdminAddTreeTypeDto {
  @IsNotEmpty()
  @IsNumber()
  treeTypeID: number; // 树ID

  @IsNumber()
  remaining: number;
}

// 管理员删除树类
class AdminDeleteTreeTypeDto extends AdminGetTreeTypeInfoDto {}

// 管理员获取树种类列表
class AdminGetTreeTypeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page: number; // 树ID

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pagesize: number;
}

export {
  AdminAddTreeTypeDto,
  AdminUpdateTreeTypeDto,
  AdminDeleteTreeTypeDto,
  AdminGetTreeTypeDto,
  AdminGetTreeTypeInfoDto,
};
