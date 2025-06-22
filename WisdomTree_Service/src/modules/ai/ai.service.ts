import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { UploadService } from '../upload/upload.service';
import { AiPlantResponseDto, AiSuggestionDto } from './ai.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('DASHSCOPE_API_KEY'),
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  // 上传植物图片并识别植物种类
  async uploadPlant(
    imageUrl: string,
    userId: number,
  ): Promise<ApiResponse<{ result: string }>> {
    try {
      // 获取用户信息
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      // 调用OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请识别图片中的植物种类，用中文回答。如果包含多个植物请分别说明。请使用以下格式回答：图片中识别到以下植物：1. (植物名称)：(特征及说明)',
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      });

      const one = await this.uploadService.deleteMethod(imageUrl);

      // 删除上传图片
      if (!one) {
        // 用户总能量加5g
        await this.userRepository.update(userId, { energy: user.energy + 5 });
        return {
          status: HttpStatus.OK,
          code: 0,
          data: {
            result: response.choices[0].message.content,
          },
          message: '识别成功,图片无需清理',
        };
      }

      // 用户总能量加5g
      await this.userRepository.update(userId, { energy: user.energy + 5 });
      return {
        status: HttpStatus.OK,
        code: 0,
        data: {
          result: response.choices[0].message.content,
        },
        message: '识别成功,图片已清理 ',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 用户上传两张图片(树叶和树木)同时上传状态 得到养护建议
  async uploadSuggestion(
    data: AiSuggestionDto,
    userId: number,
  ): Promise<ApiResponse<AiPlantResponseDto>> {
    try {
      // 获取用户信息
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      // 构造强化提示词
      const systemPrompt = `你是一名专业园艺师，请根据用户提供的树木照片、树叶照片以及当前状态描述，分析植物健康状况并给出专业养护建议。
  要求：
  1. 用中文回答
  2. 输出必须为严格JSON格式，每项不能为空
  3. 包含以下字段且内容不得为空：
  - status：识别出的植物以及它的状态
  - watering：浇水建议（频率、水量）
  - fertilization：施肥周期和肥料类型建议
  - lighting：光照需求（时长、强度）
  - notes：其他注意事项（病虫害防治/修剪技巧/季节调整/特殊养护）

  
  示例响应：
  {
    "status": "xx植物状态良好..."
    "watering": "每3天浇水一次...",
    "fertilization": "生长季节每月施一次...",
    "lighting": "需要充足散射光...",
  }`;

      const response = await this.openai.chat.completions.create({
        model: 'qwen-vl-plus',
        response_format: { type: 'json_object' }, // 强制JSON输出
        messages: [
          {
            role: 'system',
            content: [{ type: 'text', text: systemPrompt }],
          },
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: data.foliageUrl } },
              { type: 'image_url', image_url: { url: data.treeUrl } },
              {
                type: 'text',
                text: `当前树木状态：${data.treeStatus}。请根据以上图片和状态给出养护建议。`,
              },
            ],
          },
        ],
      });

      // 解析并验证响应格式
      const result = JSON.parse(response.choices[0].message.content);
      if (
        !result.watering ||
        !result.fertilization ||
        !result.lighting ||
        !result.status ||
        !result.notes
      ) {
        // 将空的填充成“暂无”
        result.watering = result.watering || '暂无';
        result.fertilization = result.fertilization || '暂无';
        result.lighting = result.lighting || '暂无';
        result.notes = result.notes || '暂无';
        result.status = result.status || '暂无';
      }

      // 删除图片逻辑（根据实际需求添加）
      const [one, two] = await Promise.all([
        this.uploadService.deleteMethod(data.foliageUrl),
        this.uploadService.deleteMethod(data.treeUrl),
      ]);

      if (!one || !two) {
        // 用户总能量加5g
        await this.userRepository.update(userId, { energy: user.energy + 5 });
        return {
          status: HttpStatus.OK,
          code: 0,
          data: result,
          message: '建议生成成功，图片无需清理',
        };
      }

      // 用户总能量加5g
      await this.userRepository.update(userId, { energy: user.energy + 5 });

      return {
        status: HttpStatus.OK,
        code: 0,
        data: result,
        message: '建议生成成功，图片已清理',
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        `建议生成失败: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
