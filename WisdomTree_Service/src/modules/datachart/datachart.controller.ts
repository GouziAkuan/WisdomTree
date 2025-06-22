import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DataChartService } from './datachart.service';
import {
  TotalStatisticsDto,
  AreaDistributionDto,
  TreeTypeDistributionDto,
  AdoptionTrendDto,
  TreeTypeChartDto,
  AdoptionTypeChartDto,
  UserRunInfo,
  TreeTypeUserDto,
  UserStatisticsDto,
} from './datachart.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { AdminGuard } from '../admin/guard/admin.guard';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { ReqDto } from '../token/dto/token.dto';
import { decryptDto } from '../wxRun/wxRun.dto';

@Controller('datachart')
export class DataChartController {
  constructor(private readonly dataChartService: DataChartService) {}

  /* 用户端接口 */
  // 用户端：获取树木总量和种类总数
  @Get('user/statistics')
  @UseGuards(JwtAuthGuard)
  async getUserStatistics(): Promise<ApiResponse<UserStatisticsDto>> {
    return this.dataChartService.getUserStatistics();
  }

  //获取领养树种分布数据
  @Get('user/treetype-user')
  @UseGuards(JwtAuthGuard)
  async getTreeTypeUser(
    @Request() req: ReqDto,
  ): Promise<ApiResponse<TreeTypeUserDto[]>> {
    return this.dataChartService.getTreeTypeUser(req.user.id);
  }

  // 获取用户7日步数数据
  @Post('user/step-data')
  @UseGuards(JwtAuthGuard)
  async getStepData(
    @Body() body: decryptDto,
  ): Promise<ApiResponse<UserRunInfo[]>> {
    return this.dataChartService.getStepData(body);
  }

  /* 管理员端接口 */
  // 管理员端：获取总数统计
  @Get('admin/total')
  @UseGuards(AdminGuard)
  async getTotalStatistics(): Promise<ApiResponse<TotalStatisticsDto>> {
    return this.dataChartService.getTotalStatistics();
  }

  // 获取区域分布数据
  @Get('admin/area-distribution')
  @UseGuards(AdminGuard)
  async getAreaDistribution(): Promise<ApiResponse<AreaDistributionDto[]>> {
    return this.dataChartService.getAreaDistribution();
  }

  // 获取近7天领养趋势
  @Get('admin/adoption-trend')
  @UseGuards(AdminGuard)
  async getAdoptionTrend(): Promise<ApiResponse<AdoptionTrendDto[]>> {
    return this.dataChartService.getAdoptionTrend();
  }

  // 树种领养排行
  @Get('admin/tree-type-adoptions')
  @UseGuards(AdminGuard)
  async getTreeTypeAdoptions(): Promise<
    ApiResponse<TreeTypeDistributionDto[]>
  > {
    return this.dataChartService.getTreeTypeAdoption();
  }

  // 树种分布
  @Get('admin/tree-type-distribution')
  @UseGuards(AdminGuard)
  async getTreeTypeDistribution(): Promise<ApiResponse<TreeTypeChartDto[]>> {
    return this.dataChartService.getTreeTypeDistribution();
  }

  // 领养类型排行
  @Get('admin/adoption-type-ranking')
  @UseGuards(AdminGuard)
  async getAdoptionTypeRanking(): Promise<ApiResponse<AdoptionTypeChartDto[]>> {
    return this.dataChartService.getAdoptionTypeRanking();
  }
}
