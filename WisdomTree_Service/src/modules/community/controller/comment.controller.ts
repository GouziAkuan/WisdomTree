// src/modules/community/controllers/comment.controller.ts
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import { CommentDto } from '../dto/comment.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { ReqDto } from 'src/modules/token/dto/token.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 用户发表评论
  @Post('send')
  async create(@Body() dto: CommentDto, @Request() req: ReqDto) {
    return this.commentService.createComment(dto, req.user);
  }
}
