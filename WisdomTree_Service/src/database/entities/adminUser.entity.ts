import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ActivityEntity } from './activity.entity';

/**
 * 管理员管理员实体类。
 *
 * 该类表示数据库中的管理员管理员表，使用TypeORM的装饰器来定义表结构和字段。
 * @Entity('admin_user') 装饰器指定该类为一个实体类，并将其映射到名为admin_user的数据库表。
 */
@Entity('admin_user')
export class AdminUserEntity {
  /**
   * 管理员ID。
   *
   * 作为主键，自动增长，无符号整数。
   * @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) 装饰器指定该字段为自动增长的主键。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  /**
   * 管理员角色。
   *
   * 使用varchar类型，长度限制为20。
   * @Column({ type: 'varchar', length: 20 }) 装饰器指定该字段为一个普通的列字段，并定义其类型和长度。
   */
  @Column({ type: 'varchar', length: 20 })
  role: string;

  /**
   * 管理员名。
   *
   * 使用varchar类型，长度限制为255。
   * @Column({ type: 'varchar', length: 255 }) 装饰器指定该字段为一个普通的列字段，并定义其类型和长度。
   */
  @Column({ type: 'varchar', length: 255 })
  username: string;

  /**
   * 管理员密码。
   *
   * 使用varchar类型，长度限制为255。
   * @Column({ type: 'varchar', length: 255 }) 装饰器指定该字段为一个普通的列字段，并定义其类型和长度。
   */
  @Column({ type: 'varchar', length: 255 })
  password: string;

  /**
   * 管理员创建时间
   *
   * 自动记录管理员创建的时间戳。
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * 管理员更新时间
   *
   * 自动记录管理员信息最后一次更新的时间戳。
   */
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  // 一对多 绑定活动表
  @OneToMany(() => ActivityEntity, (activity) => activity.admin)
  activities: ActivityEntity[];
}

export default AdminUserEntity;
