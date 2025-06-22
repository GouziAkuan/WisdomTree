import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// 获取某树木详情信息
class GetTreeDetailDto {
  @IsNotEmpty({ message: '树ID不能为空' })
  @Type(() => Number) // 强制将 treeID 转换为数字
  @IsInt({ message: '请输入正确的领养记录ID' })
  adoptID: number;
}

class GetTreeTypeDetailDto {
  @IsNotEmpty({ message: '树ID不能为空' })
  @Type(() => Number) // 强制将 treeID 转换为数字
  @IsInt({ message: '请输入正确的树ID' })
  treeTypeID: number;
}

// 领养树木
class AdoptTreeDto {
  @IsNotEmpty({ message: '树ID不能为空' })
  @IsInt({ message: '请输入正确的树ID' })
  treeTypeID: number;

  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString({ message: '请输入正确的昵称' })
  nickName: string;

  // 领养区域
  @IsNotEmpty({ message: '领养区域不能为空' })
  @IsString({ message: '请输入正确的领养区域' })
  area: string;

  @IsNotEmpty({ message: '树类型不能为空' })
  @IsString({ message: '请输入正确的树类型' })
  treeType: string;

  @IsNotEmpty({ message: '愿望不能为空' })
  @IsString({ message: '请输入正确的愿望' })
  wish: string;
}

// 获取用户领养树木详情
class GetUserAdoptTreeDetailDto {
  @IsNotEmpty({ message: '领养记录的ID不能为空' })
  @IsInt({ message: '请输入正确的领养记录的ID' })
  id: number;
}

export {
  GetTreeDetailDto,
  AdoptTreeDto,
  GetUserAdoptTreeDetailDto,
  GetTreeTypeDetailDto,
};
