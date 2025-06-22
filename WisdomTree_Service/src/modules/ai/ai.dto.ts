import { IsNotEmpty, IsString } from 'class-validator';

// 用户上传一张图进行AI植物识别
class AiPlantDto {
  // 植物图片
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}

// 用户上传树叶和树木进行AI树种建议
class AiSuggestionDto {
  // 树叶图片
  @IsNotEmpty()
  @IsString()
  foliageUrl: string;
  // 树木图片
  @IsNotEmpty()
  @IsString()
  treeUrl: string;
  // 树木状态
  @IsNotEmpty()
  @IsString()
  treeStatus: string;
}

// 建议返回对象
interface AiPlantResponseDto {
  // 现在植物的状态
  status: string;
  // 浇水建议
  watering: string;
  // 施肥周期建议
  fertilization: string;
  // 光照需求建议
  lighting: string;
  // 注意事项
  notes: string;
}

export { AiPlantDto, AiSuggestionDto, AiPlantResponseDto };
