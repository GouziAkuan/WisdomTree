import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// 发布活动dto
class publishActivityDto {
  // 标题
  @IsNotEmpty()
  @IsString()
  title: string;

  // 内容
  @IsNotEmpty()
  @IsString()
  content: string;

  // 图片
  @IsNotEmpty()
  @IsString()
  coverImageUrl: string;

  // 开始时间
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  // 结束时间
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  // 地点
  @IsNotEmpty()
  @IsString()
  location: string;

  // 设定人数
  @IsNotEmpty()
  @IsNumber()
  plannedCapacity: number;
}

// 报名活动DTO
class SignUpActivityDTO {
  @IsNotEmpty()
  @IsNumber()
  // 报名活动id
  id: number;
}

// 管理员查询活动列表（分页）Dto
class ActivityAdminListQueryDto {
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Type(() => Number)
  pageSize: number;
}

export { publishActivityDto, SignUpActivityDTO, ActivityAdminListQueryDto };
