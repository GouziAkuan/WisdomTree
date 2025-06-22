import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TreeImagesEntity } from './treeImages.entity';
import { AdoptionsEntity } from './adoptions.entity';
import { TreeTypeEntity } from './treeType.entity';

/**
 * 树木实体类
 * 该类代表数据库中树木表的实体，包括树木的基本信息和关联信息。
 */
@Entity('trees')
export class TreeEntity {
  /**
   * 树木ID
   * 自增长的主键，用于唯一标识每棵树木。
   */
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // 是否领养
  @Column({ type: 'boolean', default: false })
  isAdopted: boolean;

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

  /**
   * 树木图片
   * 与该树木关联的图片集合，每棵树木可以有多个图片。
   */
  @OneToMany(() => TreeImagesEntity, (treeImage) => treeImage.tree)
  images: TreeImagesEntity[];

  /**
   * 树木认养
   * 与该树木关联的认养信息集合，每棵树木可以被多次认养。
   */
  @OneToMany(() => AdoptionsEntity, (adoptions) => adoptions.tree)
  adoptions: AdoptionsEntity[];

  // 树木种类，外键和treeType表关联
  @ManyToOne(() => TreeTypeEntity, (treeType) => treeType.trees)
  @JoinColumn({ name: 'type_id' })
  type_id: TreeTypeEntity;
}
