import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, PaginationDto } from '../dto/comment.dto';
import { CommentEntity } from '../../../database/entities/community/comment.entity';
import { LikeEntity } from '../../../database/entities/community/likes.entity';
import {
  ApiResponse,
  ApiResponseSuccess,
} from 'src/common/interfaces/res.interface';
import { PostEntity } from 'src/database/entities/community/post.entity';
import { CollectEntity } from 'src/database/entities/collect.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepo: Repository<LikeEntity>,
    @InjectRepository(CollectEntity)
    private readonly collectRepo: Repository<CollectEntity>,
  ) {}

  // 创建帖子
  async createPost(dto: CreatePostDto, userId: number): Promise<ApiResponse> {
    try {
      // 验证用户是否存在
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('用户不存在');

      // 创建帖子
      const post = this.postRepo.create({
        ...dto,
        user: { id: userId },
      });

      await this.postRepo.save(post);

      // 用户总能量加10g
      await this.userRepo.update(userId, { energy: user.energy + 10 });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '创建成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 按类型分页获取帖子列表
  async getPostsByType(
    dto: PaginationDto,
    userId: number,
  ): Promise<ApiResponse> {
    try {
      const whereCondition = dto.type === 'all' ? {} : { type: dto.type };

      const [posts, total]: [PostEntity[], number] =
        await this.postRepo.findAndCount({
          where: whereCondition,
          relations: ['user'],
          order: { createdAt: 'DESC' },
          skip: (dto.page - 1) * dto.pageSize,
          take: dto.pageSize,
        });

      // 计算评论数和格式化封面
      const list = await Promise.all(
        posts.map(async (item: PostEntity) => ({
          id: item.id,
          title: item.title,
          cover: item.images?.[0] || null, // 处理空数组情况
          likeCount: (await this.likeRepo.count({
            where: { post: { id: item.id } },
          })) as number,
          // 是否点赞
          isLike:
            (await this.likeRepo.findOne({
              where: { post: { id: item.id }, user: { id: userId } },
            })) !== null,
          // 是否收藏
          isCollect:
            (await this.collectRepo.findOne({
              where: { post: { id: item.id }, user: { id: userId } },
            })) !== null,
          // 计算评论数
          commentCount: (await this.commentRepo.count({
            where: { post: { id: item.id } },
          })) as number,
          user: {
            username: item.user.username,
            avatar: item.user.avatar,
          },
        })),
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        data: {
          list,
          total,
          page: dto.page,
          pageSize: dto.pageSize,
        },
        message: '查询成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 帖子详情
  async getPostDetail(postId: number, userId: number): Promise<ApiResponse> {
    try {
      const post: PostEntity = await this.postRepo.findOne({
        where: { id: postId },
        relations: ['user', 'comments', 'comments.user', 'likes', 'collects'],
        order: { createdAt: 'DESC' },
      });

      if (!post) throw new NotFoundException('帖子不存在');

      // 格式化评论区分管理员，并按最新评论排序
      const comments = post.comments
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // 添加排序逻辑
        .map((comment: CommentEntity) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          isAdmin: comment.user?.role === 'teacher',
          user: {
            username: comment.user.username,
            avatar: comment.user.avatar,
          },
        }));

      // 是否点赞和收藏 Promise.all
      const [isLike, isCollect] = await Promise.all([
        this.likeRepo.findOne({
          where: { post: { id: postId }, user: { id: userId } },
        }),
        this.collectRepo.findOne({
          where: { post: { id: postId }, user: { id: userId } },
        }),
      ]);

      const data = {
        ...post,
        // 发帖人
        user: {
          username: post.user.username,
          avatar: post.user.avatar,
        },
        // 评论区
        comments,
        // 点赞数
        likeCount: post.likes.length,
        // 收藏数
        collectCount: post.collects.length,
        // 是否点赞和收藏
        isLike: isLike !== null,
        isCollect: isCollect !== null,
      };

      return {
        status: HttpStatus.OK,
        code: 0,
        data,
        message: '查询成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询我的帖子
  async getMyPosts(dto: PaginationDto, userId: number): Promise<ApiResponse> {
    try {
      const whereCondition =
        dto.type === 'all'
          ? { user: { id: userId } }
          : { type: dto.type, user: { id: userId } };

      const [posts, total]: [PostEntity[], number] =
        await this.postRepo.findAndCount({
          where: whereCondition,
          relations: ['user'],
          order: { createdAt: 'DESC' },
          skip: (dto.page - 1) * dto.pageSize,
          take: dto.pageSize,
        });

      // 计算评论数和格式化封面
      const list = await Promise.all(
        posts.map(async (item: PostEntity) => ({
          id: item.id,
          title: item.title,
          cover: item.images?.[0] || null, // 处理空数组情况
          likeCount: (await this.likeRepo.count({
            where: { post: { id: item.id } },
          })) as number,
          // 是否点赞
          isLike:
            (await this.likeRepo.findOne({
              where: { post: { id: item.id }, user: { id: userId } },
            })) !== null,
          // 是否收藏
          isCollect:
            (await this.collectRepo.findOne({
              where: { post: { id: item.id }, user: { id: userId } },
            })) !== null,
          commentCount: (await this.commentRepo.count({
            where: { post: { id: item.id } },
          })) as number,
          user: {
            username: item.user.username,
            avatar: item.user.avatar,
          },
        })),
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        data: {
          list,
          total,
          page: dto.page,
          pageSize: dto.pageSize,
        },
        message: '查询成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // 删除帖子
  async deletePost(postId: number): Promise<ApiResponse> {
    try {
      // 验证操作者是否为管理员（需在控制器层校验权限）
      // 先删除相关评论
      await this.commentRepo.delete({ post: { id: postId } });

      // 相关点赞
      await this.likeRepo.delete({ post: { id: postId } });

      // 删除帖子
      await this.postRepo.delete(postId);

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '删除成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 点赞/取消点赞
  async toggleLike(postId: number, userId: number): Promise<ApiResponse> {
    try {
      // 检查用户是否存在
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('用户不存在');

      // 检查帖子是否存在
      const post = await this.postRepo.findOneBy({ id: postId });
      if (!post) throw new NotFoundException('帖子不存在');

      // 查询是否已点赞
      const existingLike = await this.likeRepo.findOneBy({
        user: { id: userId },
        post: { id: postId },
      });

      if (existingLike) {
        // 取消点赞 删除记录
        await this.likeRepo.delete({
          user: { id: userId },
          post: { id: postId },
        });
        return {
          status: HttpStatus.OK,
          code: 0,
          message: '取消点赞成功',
        };
      } else {
        // 点赞
        await this.likeRepo.save({
          user: user,
          post: post,
        });

        // 用户总能量加5g
        await this.userRepo.update(userId, { energy: user.energy + 5 });

        return {
          status: HttpStatus.OK,
          code: 0,
          message: '点赞成功',
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取所有帖子数量
  async getPostCount(): Promise<ApiResponse<number>> {
    try {
      const count = await this.postRepo.count();
      return {
        status: HttpStatus.OK,
        code: 0,
        data: count,
        message: '查询成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 收藏/取消收藏帖子
  async collectPost(
    postId: number,
    userId: number,
  ): Promise<ApiResponseSuccess> {
    try {
      // 检查用户是否存在
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('用户不存在');

      // 检查帖子是否存在
      const post = await this.postRepo.findOneBy({ id: postId });
      if (!post) throw new NotFoundException('帖子不存在');

      // 查询是否已收藏
      const existingCollection = await this.collectRepo.findOneBy({
        user: { id: userId },
        post: { id: postId },
      });

      if (existingCollection) {
        // 取消收藏 删除记录
        await this.collectRepo.delete({
          user: { id: userId },
          post: { id: postId },
        });
        return {
          status: HttpStatus.OK,
          code: 0,
          message: '取消收藏成功',
        };
      } else {
        // 收藏
        await this.collectRepo.save({ user: user, post: post });
        // 用户总能量加5g
        await this.userRepo.update(userId, { energy: user.energy + 5 });
        return {
          status: HttpStatus.OK,
          code: 0,
          message: '收藏成功',
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 获取我收藏的帖子列表
  async getMyCollectPost(userId: number): Promise<ApiResponse> {
    try {
      const collects = await this.collectRepo.find({
        where: { user: { id: userId } },
        relations: ['post', 'post.user'],
      });

      // 计算评论数和格式化封面
      const list = await Promise.all(
        collects.map(async (item: any) => ({
          id: item.post.id,
          title: item.post.title,
          cover: item.post.images?.[0] || null, // 处理空数组情况
          likeCount: await this.likeRepo.count({
            where: { post: { id: item.post.id } },
          }),
          commentCount: await this.commentRepo.count({
            where: { post: { id: item.post.id } },
          }),
          // 是否点赞
          isLike:
            (await this.likeRepo.findOne({
              where: { post: { id: item.post.id }, user: { id: userId } },
            })) !== null,
          // 是否收藏
          isCollect:
            (await this.collectRepo.findOne({
              where: { post: { id: item.id }, user: { id: userId } },
            })) !== null,
          // 帖子类型
          type: item.post.type,
          user: {
            username: item.post.user.username,
            avatar: item.post.user.avatar,
          },
        })),
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        data: list,
        message: '查询成功',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
