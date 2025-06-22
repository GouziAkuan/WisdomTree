import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  AdoptTreeRequestDto,
  GetTreeDetailRequestDto,
  GetTreeRequestDto,
  GetUserAdoptTreeDetailRequestDto,
} from './dto/treeRequest.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { TreeService } from './tree.service';
import {
  AdoptTreeDto,
  GetTreeDetailDto,
  GetTreeTypeDetailDto,
} from './dto/tree.dto';
import { ReqDto } from '../token/dto/token.dto';
import { ApiResponse } from 'src/common/interfaces/res.interface';

@Controller('tree')
@UseGuards(JwtAuthGuard)
export class TreeController {
  constructor(private readonly treeservice: TreeService) {}

  // 获取树木列表
  @Get('getTree')
  async getTree(@Request() req: ReqDto): Promise<GetTreeRequestDto> {
    return await this.treeservice.getTree(req.user.id);
  }

  // 获取某树木详情信息
  @Get('getTreeDetail')
  async getTreeDetail(
    @Query() query: GetTreeTypeDetailDto,
    @Request() req: ReqDto,
  ): Promise<GetTreeDetailRequestDto> {
    return await this.treeservice.getTreeDetail(query.treeTypeID, req.user.id);
  }

  // 领养树木
  @Post('adoptTree')
  async adoptTree(
    @Body() body: AdoptTreeDto,
    @Request() req: ReqDto,
  ): Promise<AdoptTreeRequestDto> {
    return await this.treeservice.adoptTree(body, req.user.id);
  }

  // 获取用户领养树木列表
  @Get('getUserTree')
  async getUserTree(@Request() req: any): Promise<ApiResponse> {
    return await this.treeservice.getUserTree(req.user.id);
  }

  // 获取用户领养树木详情
  @Get('getUserTreeDetail')
  async getUserTreeDetail(
    @Query() query: GetTreeDetailDto,
  ): Promise<GetUserAdoptTreeDetailRequestDto> {
    return await this.treeservice.getUserTreeDetail(query.adoptID);
  }
}
