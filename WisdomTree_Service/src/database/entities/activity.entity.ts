// 活动表
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import AdminUserEntity from './adminUser.entity';
import { UserEntity } from './user.entity';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID

  @Column()
  title: string; // 标题

  @Column({ type: 'text' })
  content: string; // 内容

  @Column()
  coverImageUrl: string; // 封面图片url

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date; // 活动开始时间

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  endTime: Date; // 活动结束时间

  @Column()
  location: string; // 地点

  @Column()
  plannedCapacity: number; // 设定人数

  @Column({ default: 0 })
  currentCapacity: number; // 目前人数

  @CreateDateColumn()
  createdAt: Date; // 创建时间（自动）

  @UpdateDateColumn()
  updatedAt: Date; // 修改时间（自动）

  // 多对一 绑定管理员
  @ManyToOne(() => AdminUserEntity, (admin) => admin.activities)
  admin: AdminUserEntity;

  // 多对多绑定用户 多对多相当于弄一个中间表 分别多对一绑定用户和活动 相当于中间表就是报名记录表 所以当多对多出现的时候 往往设计的时候少了一个表
  @ManyToMany(() => UserEntity, (users) => users.activities)
  @JoinTable({
    name: 'activity_users', // 自定义中间表名称（可选）
    joinColumn: { name: 'activity_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: UserEntity[];
}
