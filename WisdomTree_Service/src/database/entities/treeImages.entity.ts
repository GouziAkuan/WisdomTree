import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TreeEntity } from './trees.entity';
import { TreeTypeEntity } from './treeType.entity';

/**
 * 树图片实体类
 *
 * 该类表示与树相关的图片信息，包括图片的URL和创建/更新时间。
 * 它通过多对一的关系与树实体关联，每个树可以有多个图片。
 */
@Entity('tree_images')
export class TreeImagesEntity {
  /**
   * 图片ID
   *
   * 自动生成的主键，用于唯一标识每张图片。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  /**
   * 图片URL
   *
   * 存储图片的网络地址，用于访问图片。
   */
  @Column({ type: 'varchar', length: 255 })
  detailImage: string;

  /**
   * 创建时间
   *
   * 记录图片的创建时间，当图片插入数据库时自动填充。
   */
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  /**
   * 更新时间
   *
   * 记录图片的最后更新时间，当图片信息被修改时自动更新。
   */
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updated_at: Date;

  /**
   * 关联的树实体
   *
   * 通过多对一的关系，每个图片与一颗树相关联。
   * 使用JoinColumn指定外键列名为tree_id。
   */
  @ManyToOne(() => TreeEntity, (tree) => tree.images)
  @JoinColumn({ name: 'tree_id' }) // 指定外键列的名字
  tree: TreeEntity;

  @ManyToOne(() => TreeTypeEntity, (treeType) => treeType.treeImages)
  @JoinColumn({ name: 'type_id' })
  type_id: TreeTypeEntity;
}
