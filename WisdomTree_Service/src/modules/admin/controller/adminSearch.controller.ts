import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guard/admin.guard';
import { AdminSearchService } from '../service/adminSearch.service';
import { AdminSearchUserDto, searchTreeType } from '../dto/adminSearch.dto';
import {
  AdminSearchTreeTypeRes,
  AdminSearchUserRes,
} from '../dto/adminSearchRes';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminSearchController {
  constructor(private readonly adminSearchService: AdminSearchService) {}

  @Get('searchTreeType')
  // 搜索树种
  async searchTreeType(
    @Query() query: searchTreeType,
  ): Promise<AdminSearchTreeTypeRes> {
    return await this.adminSearchService.searchTreeType(query.treeTypeInput);
  }

  // 搜索用户
  @Get('/searchUser')
  async searchUser(
    @Query() query: AdminSearchUserDto,
  ): Promise<AdminSearchUserRes> {
    return await this.adminSearchService.searchUser(query.userInput);
  }
}
