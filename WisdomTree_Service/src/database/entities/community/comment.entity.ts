// 评论表
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { PostEntity } from './post.entity';
import { UserEntity } from '../user.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string; // 评论内容

  @CreateDateColumn()
  createdAt: Date; // 创建时间

  @UpdateDateColumn()
  updatedAt: Date; // 更新时间

  // 关联帖子
  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  // 关联用户（评论人）
  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}
