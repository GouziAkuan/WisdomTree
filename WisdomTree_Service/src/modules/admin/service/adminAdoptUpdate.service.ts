import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeImagesEntity } from 'src/database/entities/treeImages.entity';
import { TreeEntity } from 'src/database/entities/trees.entity';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { TreeService } from 'src/modules/tree/tree.service';
import { Repository } from 'typeorm';
import { BadAdminPutTreeImageException } from '../exception/adminTree.exception';
import { AdoptTreeNumberRequestDto } from 'src/modules/tree/dto/treeRequest.dto';

@Injectable()
export class AdminAdoptUpdateService {
  constructor(
    @InjectRepository(TreeEntity)
    private readonly treeRepository: Repository<TreeEntity>,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
    @InjectRepository(TreeImagesEntity)
    private readonly treeImagesRepository: Repository<TreeImagesEntity>,
    private readonly treeService: TreeService,
  ) {}

  // 更新详情图片
  async updateTreeImage(
    treeID: number,
    detailImage: Array<string>,
    newTreeTypeID: number,
  ): Promise<void> {
    try {
      // 更新tree_images表中的图片信息
      // 1. 删除旧的图片记录（这里的旧不是新旧树的旧 是选择的树此时此刻的图片和原来图片的新旧 所有id都是一个）
      await this.treeImagesRepository.delete({ tree: { id: treeID } });

      // 2. 插入新的图片记录
      // TypeORM 的 insert() 方法可以接受一个对象数组，并将这些对象批量插入到数据库中
      await this.treeImagesRepository.insert(
        detailImage.map((item: any) => {
          return {
            detailImage: item as string, // 图片地址
            tree: { id: treeID }, // 外键关联到树木ID
            type_id: { id: newTreeTypeID },
          };
        }),
      );
    } catch {
      throw new BadAdminPutTreeImageException();
    }
  }

  // 树处理的相关逻辑（复原旧的，更新新的）
  async updateTree(
    oldTreeID: number,
    oldTreeTypeID: number,
    newTreeTypeID: number,
  ) {
    // 处理树的逻辑
    // 复原旧的
    // 将原来的树（tree表）领养字段改成false
    await this.treeRepository.update(
      { id: oldTreeID },
      {
        isAdopted: false,
      },
    );
    // 树的数量复原（treetype表）
    await this.treeTypeRepository.update(
      {
        id: oldTreeTypeID,
      },
      {
        remaining: () => 'remaining + 1',
      },
    );
    // 更新新的
    // 领养树木数量处理（实现将树isAdopted字段为true，treeType表更新） 通过tree模块进行处理
    const adoptionTreeInfo: AdoptTreeNumberRequestDto =
      await this.treeService.adoptTreeNumber(newTreeTypeID);

    // 生成独特的领养编号 通过tree模块进行处理
    const adoptionID = await this.treeService.getAdoptionsID(adoptionTreeInfo);

    return { adoptionID, newTreeID: adoptionTreeInfo.treeId };
  }
}
