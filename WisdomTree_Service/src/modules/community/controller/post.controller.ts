import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import {
  CreatePostDto,
  PaginationDto,
  PostDetailDto,
  DeletePostDto,
  LikePostDto,
  CollectPostDto,
} from '../dto/comment.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { ReqDto } from 'src/modules/token/dto/token.dto';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { AdminGuard } from 'src/modules/admin/guard/admin.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 创建帖子
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreatePostDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse> {
    return await this.postService.createPost(dto, req.user.id);
  }

  //分页查询帖子
  @Get('get')
  @UseGuards(JwtAuthGuard)
  async list(
    @Query() dto: PaginationDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse> {
    return await this.postService.getPostsByType(dto, req.user.id);
  }

  // 帖子详情
  @Get('detail')
  @UseGuards(JwtAuthGuard)
  async detail(
    @Query() dto: PostDetailDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse> {
    return await this.postService.getPostDetail(dto.id, req.user.id);
  }

  // 删除帖子
  @Delete('del')
  @UseGuards(AdminGuard) // 仅管理员可删除
  async delete(@Query() dto: DeletePostDto): Promise<ApiResponse> {
    return await this.postService.deletePost(dto.id);
  }

  // 点赞/取消帖子
  @Post('like')
  @UseGuards(JwtAuthGuard)
  async like(@Body() dto: LikePostDto, @Request() req: ReqDto) {
    return await this.postService.toggleLike(dto.id, req.user.id);
  }

  // 查询我的帖子
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async myPosts(
    @Query() dto: PaginationDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse> {
    return await this.postService.getMyPosts(dto, req.user.id);
  }

  // 获取所有帖子数量
  @Get('count')
  async getPostCount(): Promise<ApiResponse> {
    return await this.postService.getPostCount();
  }

  // 收藏/取消收藏帖子
  @Post('collect')
  @UseGuards(JwtAuthGuard)
  async collect(
    @Body() dto: CollectPostDto,
    @Request() req: ReqDto,
  ): Promise<ApiResponse> {
    return await this.postService.collectPost(dto.id, req.user.id);
  }

  // 获取我收藏的帖子
  @Get('myCollect')
  @UseGuards(JwtAuthGuard)
  async myCollect(@Request() req: ReqDto): Promise<ApiResponse> {
    return await this.postService.getMyCollectPost(req.user.id);
  }
}
