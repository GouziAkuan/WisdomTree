import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

// 删除图片
class deleteFileDto {
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  fileUrl: string;
}

// 转换图片为base64
class toBase64Dto {
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  filename: string;
}

export { deleteFileDto, toBase64Dto };
