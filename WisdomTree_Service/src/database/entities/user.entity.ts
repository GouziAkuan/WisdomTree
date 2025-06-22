import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { AdoptionsEntity } from './adoptions.entity';
import { CommentEntity } from './community/comment.entity';
import { CollectEntity } from './collect.entity';
import { LikeEntity } from './community/likes.entity';
import { PostEntity } from './community/post.entity';
import { ActivityEntity } from './activity.entity';
import { EnergyEntity } from './energy.entity';

/**
 * 用户实体类
 *
 * 该类表示系统中的用户，包括用户的基本信息和相关收养记录。
 * 使用ORM框架typeorm进行数据库映射。
 */
@Entity('users')
export class UserEntity {
  /**
   * 用户ID
   *
   * 自增长的主键，用于唯一标识一个用户。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 身份 管理员or普通用户
  @Column({ type: 'varchar', length: 20 })
  role: string;

  /**
   * 用户头像链接
   *
   * 可为空，用于存储用户头像的URL。
   */
  @Column({ type: 'varchar', length: 255 })
  avatar: string;

  /**
   * 用户手机号码
   *
   */
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  /**
   * 用户名
   *
   * 唯一字段，用于注册和登录验证。
   */
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  /**
   * 用户密码
   *
   * 存储用户加密后的密码，用于登录验证。
   */
  @Column({ type: 'varchar', length: 255 })
  password: string;

  // 用户能量
  @Column({ type: 'int', default: 0 })
  energy: number;

  // 微信用户唯一标识
  @Column({ type: 'varchar' })
  openid: string;

  /**
   * 用户创建时间
   *
   * 自动记录用户创建的时间戳。
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * 用户更新时间
   *
   * 自动记录用户信息最后一次更新的时间戳。
   */
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  /**
   * 用户的收养记录
   *
   * 一对多关系，一个用户可以有多个收养记录。
   */
  @OneToMany(() => AdoptionsEntity, (adoption) => adoption.user)
  adoptions: AdoptionsEntity[];

  // 一对多绑定评论表
  @OneToMany(() => CommentEntity, (comments) => comments.user)
  comments: AdoptionsEntity[];

  // 一对多绑定收藏表
  @OneToMany(() => CollectEntity, (collects) => collects.user)
  collects: CollectEntity[];

  // 一对多绑定点赞表
  @OneToMany(() => LikeEntity, (likes) => likes.user)
  likes: LikeEntity[];

  // 一对多绑定帖子表
  @OneToMany(() => PostEntity, (posts) => posts.user)
  posts: PostEntity[];

  // 一对多绑定能量表
  @OneToMany(() => EnergyEntity, (energys) => energys.user)
  energys: EnergyEntity[];

  // 多对多绑定活动
  @ManyToMany(() => ActivityEntity, (activity) => activity.users)
  activities: ActivityEntity[];
}
