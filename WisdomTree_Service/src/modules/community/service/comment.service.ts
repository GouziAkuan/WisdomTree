// src/modules/community/services/comment.service.ts
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../../database/entities/community/comment.entity';
import { CommentDto } from '../dto/comment.dto';
import { ParseTokenDto } from 'src/modules/token/dto/token.dto';
import { ApiResponse } from 'src/common/interfaces/res.interface';
import { PostEntity } from 'src/database/entities/community/post.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  // 发表评论
  async createComment(
    dto: CommentDto,
    userInfo: ParseTokenDto,
  ): Promise<ApiResponse> {
    // 验证用户和帖子存在
    const user = await this.userRepo.findOneBy({ id: userInfo.id });
    if (!user) throw new NotFoundException('用户不存在');

    const post = await this.postRepo.findOneBy({ id: dto.postId });
    if (!post) throw new NotFoundException('帖子不存在');

    // 创建评论
    const comment = this.commentRepo.create({
      content: dto.content,
      user: user,
      post,
    });

    await this.commentRepo.save(comment);

    // 用户总能量加5g
    await this.userRepo.update(userInfo.id, { energy: user.energy + 5 });

    // 获取新的帖子详情的评论区
    post.comments = await this.commentRepo.find({
      where: { post: { id: dto.postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    // 返回此帖子评论区
    const comments = post.comments.map((comment: CommentEntity) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      isAdmin: comment.user.role === 'teacher',
      user: {
        username: comment.user.username,
        avatar: comment.user.avatar,
      },
    }));

    // 返回格式化数据
    return {
      status: HttpStatus.OK,
      code: 0,
      message: '评论成功',
      data: comments,
    };
  }
}
