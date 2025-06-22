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
import {
  AdminCreateTreeResDto,
  AdminDeleteTreeResDto,
  AdminGetTreeFilterResDto,
  AdminGetTreeReqDto,
  AdminTreeDeailReqDto,
  AdminUpdateTreeImageResDto,
} from '../dto/adminTreeRes.dto';
import { AdminTreeService } from '../service/adminTree.service';
import {
  AdminCreateTreesDto,
  AdminDeleteTreeDto,
  AdminGetTreeImageDto,
  AdminGetTreeListDto,
  AdminUpdateTreeImageDto,
} from '../dto/adminTree.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminTreeController {
  constructor(private readonly adminTreeService: AdminTreeService) {}

  // 管理员创建树
  @Post('addTrees')
  async addTrees(
    @Body() body: AdminCreateTreesDto,
  ): Promise<AdminCreateTreeResDto> {
    return await this.adminTreeService.addTrees(
      body.treeType,
      body.detailImage,
    );
  }

  // 管理员获取每个树木列表（分页）
  @Get('getTreeList')
  async getTreeList(
    @Query() query: AdminGetTreeListDto,
  ): Promise<AdminGetTreeReqDto> {
    return await this.adminTreeService.getTreeList(query.page, query.pagesize);
  }

  // 管理员获取某树详情信息
  @Get('getTreeDetail')
  async getTreeDetail(
    @Query() query: AdminGetTreeImageDto,
  ): Promise<AdminTreeDeailReqDto> {
    return await this.adminTreeService.getTreeDetail(query.treeID);
  }

  // 管理员修改某树详情图片
  @Put('updateTree')
  async updateTree(
    @Body() body: AdminUpdateTreeImageDto,
  ): Promise<AdminUpdateTreeImageResDto> {
    return await this.adminTreeService.updateTree(
      body.treeID,
      body.treeType,
      body.detailImage,
    );
  }

  // 管理员删除某树
  @Delete('deleteTree')
  async deleteTree(
    @Query() query: AdminDeleteTreeDto,
  ): Promise<AdminDeleteTreeResDto> {
    return await this.adminTreeService.deleteTree(query.treeID);
  }

  // 管理员获取树木筛选值
  @Get('getTreeFilter')
  async getTreeFilter(): Promise<AdminGetTreeFilterResDto> {
    return await this.adminTreeService.getTreeFilter();
  }
}
