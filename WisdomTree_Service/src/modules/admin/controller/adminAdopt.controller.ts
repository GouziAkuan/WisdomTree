import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';
import { AdminAdoptService } from '../service/adminAdopt.service';
import {
  AdminDelAdoptRes,
  AdminGetAdoptDetailRes,
  AdminGetAdoptRes,
  AdminPutAdoptDetailRes,
} from '../dto/adminAdoptRes';
import {
  AdminDeleteDto,
  AdminGetAdoptDto,
  AdminPutAdoptDetailDto,
} from '../dto/adminAdopt';
import { AdminGetTreeListDto } from '../dto/adminTree.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminAdoptController {
  constructor(private readonly adminAdoptService: AdminAdoptService) {}

  @Get('getAdoptList')
  // 管理员获取领养表（分页）
  async getAdoptList(
    @Query() query: AdminGetTreeListDto,
  ): Promise<AdminGetAdoptRes> {
    return await this.adminAdoptService.getAdoptList(
      query.page,
      query.pagesize,
    );
  }

  // 管理员获取某领养详情
  @Get('getAdoptDetail')
  async getAdoptDetail(
    @Query() query: AdminGetAdoptDto,
  ): Promise<AdminGetAdoptDetailRes> {
    return await this.adminAdoptService.getAdoptDetail(query.AdoptID);
  }

  // 管理员修改领养信息
  @Put('updateAdopt')
  async updateAdopt(
    @Body() body: AdminPutAdoptDetailDto,
  ): Promise<AdminPutAdoptDetailRes> {
    return await this.adminAdoptService.updateAdopt(body);
  }

  // 管理员删除领养信息
  @Delete('deleteAdopt')
  async deleteAdopt(@Query() query: AdminDeleteDto): Promise<AdminDelAdoptRes> {
    return await this.adminAdoptService.deleteAdopt(query.AdoptID);
  }
}
