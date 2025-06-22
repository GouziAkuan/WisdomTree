import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApiResponse,
  ApiResponseSuccess,
} from 'src/common/interfaces/res.interface';
import { ActivityEntity } from 'src/database/entities/activity.entity';
import { Repository } from 'typeorm';
import { publishActivityDto } from './activity.dto';
import AdminUserEntity from 'src/database/entities/adminUser.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminRepository: Repository<AdminUserEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 管理员部分
  // 发布活动
  async publishActivity(
    activity: publishActivityDto,
    adminId: number,
  ): Promise<ApiResponse> {
    try {
      // 显式加载管理员实体
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
      });
      await this.activityRepository.save({
        ...activity,
        admin,
      });
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '发布成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 管理员查询活动列表（分页）
  async getActivityAdminList(
    // adminId: number,
    page: number,
    pageSize: number,
  ): Promise<ApiResponse> {
    try {
      const skip = (page - 1) * pageSize; // 计算跳过的记录数
      const [activities, total] = await this.activityRepository.findAndCount({
        // where: { admin: { id: adminId } },
        take: pageSize, // 每页条数
        skip, // 跳过条数
      });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: {
          total, // 总记录数
          page, // 当前页码
          pageSize, // 每页条数
          activities,
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 管理员获取活动详情
  async getActivityAdminDetail(activityId: number): Promise<ApiResponse> {
    try {
      // 查询活动详情
      const activity = await this.activityRepository.findOne({
        where: { id: activityId },
        // relations: ['admin'], // 加载关联的管理员信息
      });

      if (!activity) {
        throw new HttpException('活动不存在', HttpStatus.NOT_FOUND);
      }

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: activity,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 编辑活动
  async editActivity(
    activityID: number,
    updateData: publishActivityDto,
  ): Promise<ApiResponse> {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id: activityID },
      });

      // 如果设定人数小于目前人数，不能修改
      if (activity.currentCapacity > updateData.plannedCapacity) {
        throw new HttpException(
          '活动人数不能小于当前活动人数',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.activityRepository.update(activityID, updateData);
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '修改成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 删除活动
  async deleteActivity(activityId: number): Promise<ApiResponse> {
    try {
      await this.activityRepository.delete(activityId);
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '删除成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 用户部分
  // 查询全部活动列表
  async getActivityList(): Promise<ApiResponse> {
    try {
      const activities = await this.activityRepository.find();
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: activities,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 报名活动
  async signUpActivity(
    userId: number,
    activityId: number,
  ): Promise<ApiResponseSuccess> {
    try {
      // 检查活动是否存在
      const activity = await this.activityRepository.findOneBy({
        id: activityId,
      });
      if (!activity) {
        throw new HttpException('活动不存在', HttpStatus.NOT_FOUND);
      }

      // 检查用户是否存在
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['activities'], // 加载已关联活动
      });
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }

      // 检查是否已报名
      const isRegistered = user.activities.some((a) => a.id === activityId);
      if (isRegistered) {
        return {
          status: HttpStatus.OK,
          code: 1,
          message: '您已报名该活动',
        };
      }

      // 检查活动是否已满
      if (activity.currentCapacity >= activity.plannedCapacity) {
        return {
          status: HttpStatus.OK,
          code: 2,
          message: '活动已满',
        };
      }

      // 添加多对多关联（更新中间表）
      user.activities.push(activity); // 添加关联
      activity.currentCapacity += 1; // 更新报名人数

      // 使用事务保证一致性
      await this.userRepository.manager.transaction(async (manager) => {
        await manager.save(user);
        await manager.save(activity);
      });

      // 用户总能量加5g
      await this.userRepository.update(userId, { energy: user.energy + 5 });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '报名成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 查询已报名的活动
  async getSignUpActivityList(userId: number): Promise<ApiResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['activities'],
      });

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '查询成功',
        data: user.activities,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
