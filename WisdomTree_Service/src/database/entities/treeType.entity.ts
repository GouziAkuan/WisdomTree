import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { TreeEntity } from './trees.entity';
import { TreeImagesEntity } from './treeImages.entity';
import { AdoptionsEntity } from './adoptions.entity';

/**
 * 树木实体类
 * 该类代表数据库中树木表的实体，包括树木的基本信息和关联信息。
 */
@Entity('tree_type')
@Unique(['scientific_name'])
export class TreeTypeEntity {
  /**
   * 树木ID
   * 自增长的主键，用于唯一标识每棵树木。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 树木头像
  @Column({ type: 'varchar', length: 255 })
  avatar: string;

  /**
   * 树木种类的科学名称。
   */
  @Column({ type: 'varchar', length: 100 })
  scientific_name: string;

  /**
   * 普通名
   * 树木的通俗名称，便于公众理解和识别。
   */
  @Column({ type: 'varchar', length: 100 })
  common_name: string;

  /**
   * 描述
   * 关于树木的详细描述信息，包括特征、习性等
   */
  @Column({ type: 'text' })
  description: string;

  // 树木总量
  @Column({ type: 'int' })
  total: number;

  // 剩余数量
  @Column({ type: 'int' })
  remaining: number;

  // 领取所需能量
  @Column({ type: 'int', default: 0 })
  energy: number;

  /**
   * 创建时间
   * 记录树木信息的创建时间
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * 更新时间
   * 记录树木信息的最后更新时间，可为空。
   */
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updated_at: Date;

  // 外键 tree表的type_id
  @OneToMany(() => TreeEntity, (tree) => tree.type_id)
  trees: TreeEntity[];

  // 一对多 一个树种有多个树木详情图片 外键treeimage表的type_id
  @OneToMany(() => TreeImagesEntity, (treeImage) => treeImage.type_id)
  treeImages: TreeImagesEntity[];

  // 一对多 一个树种多个领养 外键adoptions表的type_id
  @OneToMany(() => AdoptionsEntity, (adoption) => adoption.type_id)
  adoptions: AdoptionsEntity[];
}
