import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import day from 'dayjs';
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
import { TreeEntity } from 'src/database/entities/trees.entity';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { AdoptionsEntity } from 'src/database/entities/adoptions.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { wxRunService } from '../wxRun/wxRun.service';
import { decryptDto, wxRunRes } from '../wxRun/wxRun.dto';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataChartService {
  constructor(
    @InjectRepository(TreeEntity)
    private readonly treeRepo: Repository<TreeEntity>,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepo: Repository<TreeTypeEntity>,
    @InjectRepository(AdoptionsEntity)
    private readonly adoptionRepo: Repository<AdoptionsEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly wxRunservice: wxRunService,
    private readonly configService: ConfigService,
  ) {}

  // 用户端：获取树木总量和种类总数
  async getUserStatistics(): Promise<ApiResponse<UserStatisticsDto>> {
    try {
      // 同时查询树木总量和种类总数
      const [totalTrees, totalTypes] = await Promise.all([
        this.treeRepo.count(),
        this.treeTypeRepo.count(),
      ]);
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: {
          totalTrees,
          totalTypes,
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //用户获取其领养树种分布数据
  async getTreeTypeUser(
    userId: number,
  ): Promise<ApiResponse<TreeTypeUserDto[]>> {
    try {
      const data = await this.adoptionRepo
        .createQueryBuilder('adoption')
        .innerJoinAndSelect('adoption.type_id', 'treeType')
        .select('treeType.scientific_name', 'treeType')
        .addSelect('COUNT(*)', 'count')
        .where('adoption.user_id = :userId', { userId })
        .groupBy('treeType.scientific_name')
        .orderBy('count', 'DESC')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '获取领养分布失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取用户7日步数数据
  async getStepData(body: decryptDto): Promise<ApiResponse<UserRunInfo[]>> {
    try {
      // 1. 获取 sessionInfo
      const sessionInfo = await this.wxRunservice.getSessionKey(body.code);
      // 2. 解密数据得到31天的微信数据
      const decryptedData: wxRunRes = this.wxRunservice.decryptData(
        body.encryptedData,
        body.iv,
        sessionInfo.session_key,
      );

      // 3. 验证数据完整性
      if (
        decryptedData.watermark.appid !== this.configService.get('WX_APPID')
      ) {
        throw new Error('数据校验失败');
      }

      // 4. 截取decryptedData.stepInfoList最后7日步数数据
      const last7DaysSteps = decryptedData.stepInfoList
        .slice(-7) // 取最后7个元素
        .map((item) => ({
          date: dayjs(item.timestamp * 1000).format('MM-DD'), // 转换时间戳为日期
          step: item.step,
        }));

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: last7DaysSteps,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 管理员端：获取总数统计
  async getTotalStatistics(): Promise<ApiResponse<TotalStatisticsDto>> {
    try {
      const [totalTrees, totalTreeTypes, totalAdoptions, totalUsers] =
        await Promise.all([
          this.treeRepo.count(),
          this.treeTypeRepo.count(),
          this.adoptionRepo.count(),
          this.userRepo.count(),
        ]);
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: {
          totalTrees,
          totalTreeTypes,
          totalAdoptions,
          totalUsers,
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取区域分布数据
  async getAreaDistribution(): Promise<ApiResponse<AreaDistributionDto[]>> {
    try {
      const data = await this.adoptionRepo
        .createQueryBuilder('adoption')
        .select('adoption.area', 'area')
        .addSelect('COUNT(*)', 'count')
        .groupBy('adoption.area')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取近7天领养趋势
  // 修改后的获取近7天领养趋势方法
  async getAdoptionTrend(): Promise<ApiResponse<AdoptionTrendDto[]>> {
    try {
      const endDate = day().endOf('day'); // 当前日期的23:59:59
      const startDate = day().subtract(6, 'days').startOf('day'); // 7天前的00:00:00

      // 生成完整的7天日期列表（用于填充缺失日期）
      const dateMap = new Map<string, number>();
      for (let i = 0; i < 7; i++) {
        const date = startDate.add(i, 'day').format('YYYY-MM-DD');
        dateMap.set(date, 0);
      }

      // 查询数据库
      const rawData = await this.adoptionRepo
        .createQueryBuilder('adoption')
        .select(`DATE_FORMAT(adoption.adopted_at, '%Y-%m-%d')`, 'date')
        .addSelect('COUNT(*)', 'count')
        .where('adoption.adopted_at BETWEEN :start AND :end', {
          start: startDate.toDate(),
          end: endDate.toDate(),
        })
        .groupBy('date')
        .orderBy('date', 'ASC')
        .getRawMany();

      // 合并数据（填充缺失日期）
      rawData.forEach((item) => dateMap.set(item.date, parseInt(item.count)));

      // 转换为有序数组
      const data = Array.from(dateMap).map(([date, count]) => ({
        date: day(date).format('MM-DD'),
        count,
      }));

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // 树种领养排行
  async getTreeTypeAdoption(): Promise<ApiResponse<TreeTypeDistributionDto[]>> {
    try {
      const data = await this.adoptionRepo
        .createQueryBuilder('adoption')
        .innerJoinAndSelect('adoption.type_id', 'treeType')
        .select('treeType.scientific_name', 'treeType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('treeType.scientific_name')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 树种分布统计
  async getTreeTypeDistribution(): Promise<ApiResponse<TreeTypeChartDto[]>> {
    try {
      const data = await this.treeRepo
        .createQueryBuilder('tree')
        .innerJoinAndSelect('tree.type_id', 'treeType')
        .select('treeType.scientific_name', 'treeType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('treeType.scientific_name')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 领养类型排行统计
  async getAdoptionTypeRanking(): Promise<ApiResponse<AdoptionTypeChartDto[]>> {
    try {
      const data = await this.adoptionRepo
        .createQueryBuilder('adoption')
        .select('adoption.tree_type', 'adoptionType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('adoption.tree_type')
        .orderBy('count', 'DESC')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
