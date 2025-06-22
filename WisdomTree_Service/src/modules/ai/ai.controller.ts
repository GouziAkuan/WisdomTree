import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { AiPlantDto, AiPlantResponseDto, AiSuggestionDto } from './ai.dto';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { ReqDto } from '../token/dto/token.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // 用户上传一张图进行AI植物识别
  @Post('uploadPlant')
  async uploadPlant(
    @Body() body: AiPlantDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse<{ result: string }>> {
    return await this.aiService.uploadPlant(body.imageUrl, req.user.id);
  }

  // 用户上传两张图片(树叶和树木)同时上传状态 得到养护建议
  @Post('uploadSuggestion')
  async uploadSuggestion(
    @Body() body: AiSuggestionDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse<AiPlantResponseDto>> {
    return await this.aiService.uploadSuggestion(body, req.user.id);
  }
}
