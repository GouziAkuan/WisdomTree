// 帖子表
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './likes.entity';
import { CollectEntity } from '../collect.entity';
import { UserEntity } from '../user.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string; // 标题

  @Column('text')
  content: string; // 内容

  @Column({
    type: 'varchar', // 改为普通字符串类型
    length: 20,
    default: 'daily', // 默认值仍为 'daily'
  })
  type: string; // 类型

  // 封面图逻辑：取 imageUrls 第一张（无需单独字段）
  @Column('simple-array', { nullable: true })
  images: string[]; // 图片URL（支持多个，用数组存储）

  @CreateDateColumn()
  createdAt: Date; // 创建时间

  @UpdateDateColumn()
  updatedAt: Date; // 更新时间

  // 多对一  关联用户
  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity; // 发帖人

  //一对多  关联评论
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[]; // 关联评论

  // 一对多 关联点赞
  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  // 一对多 关联收藏
  @OneToMany(() => CollectEntity, (collect) => collect.post)
  collects: CollectEntity[];
}
