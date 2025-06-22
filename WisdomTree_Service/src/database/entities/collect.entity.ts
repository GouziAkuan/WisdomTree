import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './community/post.entity';
import { UserEntity } from './user.entity';

// 收藏帖子表
@Entity('collect')
export class CollectEntity {
  // 主键
  @PrimaryGeneratedColumn()
  id: number;

  // 帖子id（多对一）
  @ManyToOne(() => PostEntity, (post) => post.collects)
  post: PostEntity;

  // 用户id（多对一）
  @ManyToOne(() => UserEntity, (user) => user.collects)
  user: UserEntity;
}
