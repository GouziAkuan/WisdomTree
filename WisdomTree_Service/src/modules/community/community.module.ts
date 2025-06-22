import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TokenModule } from '../token/token.module';
import { PostService } from './service/post.service';
import { CommentService } from './service/comment.service';
import { PostController } from './controller/post.controller';
import { CommentController } from './controller/comment.controller';
import { AdminGuard } from '../admin/guard/admin.guard';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [PostController, CommentController],
  providers: [AdminGuard, PostService, CommentService],
})
export class CommunityModule {}
