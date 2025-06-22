import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';
import { AdminTreeTypeService } from '../service/adminTreeType.service';
import {
  AdminAddTreeTypeReqDto,
  AdminDeleteTreeTypeReqDto,
  AdminTreeTypeInfoReqDto,
  AdminTreeTypeListResDto,
  AdminUpadtTreeTypeReqDto,
} from '../dto/adminTreeTypeRes.dto';
import {
  AdminAddTreeTypeDto,
  AdminDeleteTreeTypeDto,
  AdminGetTreeTypeDto,
  AdminGetTreeTypeInfoDto,
  AdminUpdateTreeTypeDto,
} from '../dto/adminTreeType.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminTreeTypeController {
  constructor(private readonly adminTreeTypeService: AdminTreeTypeService) {}

  // 管理员增加树种类
  @Post('addTreeType')
  async addTreeType(
    @Body() body: AdminAddTreeTypeDto,
  ): Promise<AdminAddTreeTypeReqDto> {
    return await this.adminTreeTypeService.addTreeType(body);
  }

  // 管理员获取树种类列表（分页）
  @Get('getTreeTypeList')
  async getTreeTypeList(
    @Query() query: AdminGetTreeTypeDto,
  ): Promise<AdminTreeTypeListResDto> {
    return await this.adminTreeTypeService.getTreeTypeList(
      query.page,
      query.pagesize,
    );
  }

  // 管理员获取树种类信息
  @Get('getTreeTypeInfo')
  async getTreeTypeInfo(
    @Query() query: AdminGetTreeTypeInfoDto,
  ): Promise<AdminTreeTypeInfoReqDto> {
    return await this.adminTreeTypeService.getTreeTypeInfo(query.treeTypeID);
  }

  // 管理员修改树种类信息
  @Put('updateTreeType')
  async updateTreeType(
    @Body() body: AdminUpdateTreeTypeDto,
  ): Promise<AdminUpadtTreeTypeReqDto> {
    return await this.adminTreeTypeService.updateTreeType(body);
  }

  // 管理员删除树类
  @Delete('deleteTreeType')
  async deleteTreeType(
    @Query() query: AdminDeleteTreeTypeDto,
  ): Promise<AdminDeleteTreeTypeReqDto> {
    return await this.adminTreeTypeService.deleteTreeType(query.treeTypeID);
  }
}
