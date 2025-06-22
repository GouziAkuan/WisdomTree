import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { TreeEntity } from './trees.entity';
import { UserEntity } from './user.entity';
import { TreeTypeEntity } from './treeType.entity';

/**
 * `AdoptionsEntity` 类表示领养记录的实体。
 * 它映射到数据库中的 `adoptions` 表。
 */
@Entity('adoptions')
export class AdoptionsEntity {
  /**
   * 领养记录的唯一标识符。
   * 使用自增长的整数，并且为无符号类型。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 领养编号
  @Column({ type: 'varchar', length: 100, unique: true })
  adoption_id: string;

  /**
   * 领养时用户的昵称。
   * 用于标识领养时用户的个性化信息。
   */
  @Column({ type: 'varchar', length: 100 })
  nickname: string;

  // 领养区域
  @Column({ type: 'varchar', length: 100 })
  area: string;

  /**
   * 纪念树类型。
   * 用于标识领养的树木的自选类型或其他分类信息。
   */
  @Column({ type: 'varchar', length: 100 })
  tree_type: string;

  /**
   * 领养时用户的心愿。
   * 用于记录用户在领养时填写的心愿信息。
   */
  @Column({ type: 'text' })
  wish: string;

  /**
   * 领养的日期和时间。
   * 表示某些领养记录可能没有记录具体的领养时间。
   */
  @CreateDateColumn({ type: 'timestamp' })
  adopted_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  /**
   * 领养树木的用户。
   * 通过外键关联到 `UserEntity`，表示哪个用户领养了树木。
   */
  @ManyToOne(() => UserEntity, (user) => user.adoptions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /**
   * 被领养的树木。
   * 通过外键关联到 `TreeEntity`，表示哪棵树被领养了。
   */
  @ManyToOne(() => TreeEntity, (tree) => tree.adoptions)
  @JoinColumn({ name: 'tree_id' })
  tree: TreeEntity;

  /**
   * 被领养的树种。
   * 通过外键关联到 `TreeTypeEntity`，表示领养的树属于哪个种类。
   */
  @ManyToOne(() => TreeTypeEntity, (treeType) => treeType.adoptions)
  @JoinColumn({ name: 'type_id' })
  type_id: TreeTypeEntity;
}
