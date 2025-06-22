import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { ActivityService } from './activity.service';
import {
  ActivityAdminListQueryDto,
  publishActivityDto,
  SignUpActivityDTO,
} from './activity.dto';
import { ReqDto } from 'src/modules/token/dto/token.dto';
import { AdminGuard } from '../admin/guard/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/token.guard';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // 管理员部分
  // 发布活动
  @Post('publish')
  @UseGuards(AdminGuard)
  async publishActivity(
    @Body() activity: publishActivityDto,
    @Query('teacherId') teacherId: number,
  ): Promise<ApiResponse> {
    return this.activityService.publishActivity(activity, teacherId);
  }

  // 管理员查询活动列表（分页）
  @Get('adminlist')
  @UseGuards(AdminGuard)
  async getActivityAdminList(
    // @Request() req: ReqDto,
    @Query() query: ActivityAdminListQueryDto,
  ): Promise<ApiResponse> {
    const { page = 1, pageSize = 10 } = query; // 默认值：第一页，每页10条
    return this.activityService.getActivityAdminList(
      // req.user.id,
      page,
      pageSize,
    );
  }

  // 管理员获取活动详情
  @Get('adminDetail/:id')
  @UseGuards(AdminGuard)
  async getActivityAdminDetail(
    @Param('id', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse> {
    return this.activityService.getActivityAdminDetail(activityId);
  }

  // 编辑活动
  @Put(':id')
  @UseGuards(AdminGuard)
  async editActivity(
    @Param('id', ParseIntPipe) activityId: number,
    @Body() updateData: publishActivityDto,
  ): Promise<ApiResponse> {
    return this.activityService.editActivity(activityId, updateData);
  }

  // 删除活动
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteActivity(
    @Param('id', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse> {
    return this.activityService.deleteActivity(activityId);
  }

  // 用户部分
  // 查询全部活动列表
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getActivityList(): Promise<ApiResponse> {
    return this.activityService.getActivityList();
  }

  // 报名活动
  @Post('signUp')
  @UseGuards(JwtAuthGuard)
  async signUpActivity(
    @Request() req: ReqDto,
    @Body() body: SignUpActivityDTO,
  ): Promise<ApiResponse> {
    return this.activityService.signUpActivity(req.user.id, body.id);
  }

  // 查询已报名的活动
  @Get('signUpList')
  @UseGuards(JwtAuthGuard)
  async getSignUpList(@Request() req: ReqDto): Promise<ApiResponse> {
    return this.activityService.getSignUpActivityList(req.user.id);
  }
}
