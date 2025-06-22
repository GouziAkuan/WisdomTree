import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// 创建帖子
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true, message: '图片URL必须为字符串数组' })
  images: string[]; // 封面图取第一个元素
}

// 点赞帖子
export class LikePostDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

// 收藏帖子
export class CollectPostDto extends LikePostDto {}

//分页查询帖子
export class PaginationDto {
  @IsNotEmpty()
  @Type(() => Number) // 关键转换装饰器
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}

// 查看帖子详情
export class PostDetailDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

//删除帖子
export class DeletePostDto extends PostDetailDto {}

//评论
export class CommentDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
