import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { wxRunService } from './wxRun.service';
import { decryptDto, receiveEnergyDto, todayInfo } from './wxRun.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { ReqDto } from '../token/dto/token.dto';
import {
  ApiResponse,
  ApiResponseSuccess,
} from 'src/common/interfaces/res.interface';

@Controller('wxRun')
@UseGuards(JwtAuthGuard)
export class wxRunController {
  constructor(private readonly wxRunService: wxRunService) {}

  // 解密数据，获取到微信步数，处理成今日可领取的能量
  @Post('decrypt')
  async decryptData(
    @Body() body: decryptDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse<todayInfo>> {
    return this.wxRunService.decryptWeRunData(body, req.user.id);
  }

  //用户领取能量
  @Post('receive')
  async receiveEnergy(
    @Body() body: receiveEnergyDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponseSuccess> {
    return this.wxRunService.receiveEnergy(body, req.user.id);
  }

  // 合并今日数据
  @Post('merge')
  async mergeTodayData(
    @Body() body: decryptDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponseSuccess> {
    return this.wxRunService.mergeTodayData(body, req.user.id);
  }
}
