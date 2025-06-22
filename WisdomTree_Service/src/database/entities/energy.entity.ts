import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';

// 能量表
@Entity('energy')
@Unique(['user', 'date']) // 添加联合唯一约束
export class EnergyEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 今日已领取的能量值
  @Column({ type: 'int', default: 0 })
  receivedEnergy: number;

  // 今日目前的总能量值
  @Column({ type: 'int', default: 0 })
  energy: number;

  // 是否领取完能量
  @Column({ type: 'boolean', default: false })
  finish: boolean;

  // 当天日期 如2025-01-01
  @Column({ type: 'date' })
  date: string;

  // 多对一 绑定用户
  @ManyToOne(() => UserEntity, (user) => user.energy)
  user: UserEntity;
}
