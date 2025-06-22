import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

// 管理员创建树
class AdminCreateTreesDto {
  @IsString()
  treeType: string;

  @IsArray()
  @IsString({ each: true })
  detailImage: Array<string>;
}

// 管理员获取树木列表（分页）
class AdminGetTreeListDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page: number; // 页码

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pagesize: number; // 每页数量
}

// 管理员获取某树详情图片
class AdminGetTreeImageDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  treeID: number; // 树ID
}

// 管理员修改某树详情图片
class AdminUpdateTreeImageDto {
  @IsNotEmpty()
  @IsNumber()
  treeID: number; // 树ID

  @IsNotEmpty()
  @IsString()
  treeType: string;

  @IsArray()
  @IsString({ each: true })
  detailImage: Array<string>;
}

// 管理员删除树
class AdminDeleteTreeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  treeID: number; // 树ID
}

export {
  AdminGetTreeListDto,
  AdminUpdateTreeImageDto,
  AdminCreateTreesDto,
  AdminDeleteTreeDto,
  AdminGetTreeImageDto,
};
