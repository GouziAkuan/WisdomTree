import { HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminCreateTreeResDto,
  AdminDeleteTreeResDto,
  AdminGetTreeFilterResDto,
  AdminGetTreeReqDto,
  AdminTreeDeailReqDto,
  AdminUpdateTreeImageResDto,
  GetTreeDataRequestDto,
} from '../dto/adminTreeRes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadAdminGetTreeException,
  BadTreeDeleteException,
  NoTreeTypeException,
} from '../exception/adminTree.exception';
import { TreeImagesEntity } from 'src/database/entities/treeImages.entity';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { TreeEntity } from 'src/database/entities/trees.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminTreeService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TreeEntity)
    private readonly treeRepository: Repository<TreeEntity>,
    @InjectRepository(TreeImagesEntity)
    private readonly treeImagesRepository: Repository<TreeImagesEntity>,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
  ) {}

  // 管理员创建树
  async addTrees(
    treeType: string,
    detailImage: Array<string>,
  ): Promise<AdminCreateTreeResDto> {
    try {
      // 根据treeType去获取树类信息
      const treeTypeInfo: any = await this.treeTypeRepository.findOne({
        where: {
          scientific_name: treeType as string,
        },
      });

      // 如果没有树类则报错
      if (!treeTypeInfo) {
        throw new NoTreeTypeException();
      }

      // 创建树
      const tree: any = await this.treeRepository.save({
        type_id: { id: treeTypeInfo.id as number },
      });

      // 创建详情图片
      await this.treeImagesRepository.insert(
        detailImage.map((item: any) => {
          return {
            detailImage: item as string, // 图片地址
            tree: { id: tree.id }, // 外键关联到树木ID
            type_id: { id: treeTypeInfo.id }, // 外键关联到树类ID
          };
        }) as Array<TreeImagesEntity>,
      );

      // 更新树类信息的总数和剩余数量
      await this.treeTypeRepository.update(
        { id: treeTypeInfo.id },
        {
          total: () => 'total + 1',
          remaining: () => 'remaining + 1',
        },
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '创建树木成功',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 管理员获取树木列表（分页）
  async getTreeList(
    page: number,
    pagesize: number,
  ): Promise<AdminGetTreeReqDto> {
    try {
      // findAndCount不仅返回查询结果，还会返回总数 所以注意这里解构数组
      // skip参数用于跳过指定数量的记录
      // take参数用于指定每次查询要返回的记录数
      const [treeList, total] = (await this.treeRepository.findAndCount({
        relations: ['images', 'type_id'],
        skip: (page - 1) * pagesize,
        take: pagesize,
      })) as [any, number];

      // 处理获取的树信息，删除不需要的字段，并提取图像信息
      const data: Array<GetTreeDataRequestDto> = treeList.map((item: any) => {
        const { id, isAdopted } = item;
        const { scientific_name } = item.type_id;
        const detailImage: Array<string> = item.images.map((img: any) => {
          const { detailImage } = img;
          return detailImage as string;
        });
        return {
          id,
          scientific_name,
          isAdopted,
          detailImage,
        };
      });
      // 返回成功获取树列表的响应，包括状态码、代码、消息和数据
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取树木列表成功',
        data: {
          page,
          pagesize,
          total,
          treeList: data,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadAdminGetTreeException();
    }
  }

  // 管理员获取某树详情信息
  async getTreeDetail(treeID: number): Promise<AdminTreeDeailReqDto> {
    try {
      // 获取树的所属树种
      const tree: TreeEntity = await this.treeRepository.findOne({
        relations: ['type_id'],
        where: { id: treeID },
      });
      // 获取详情图片
      const detailImage: Array<TreeImagesEntity> =
        await this.treeImagesRepository.find({
          where: {
            tree: { id: treeID },
          },
        });
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取树木详情成功',
        data: {
          treeType: tree.type_id.scientific_name as string,
          detailImage: detailImage.map(
            (item: any) => item.detailImage as string,
          ) as Array<string>,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  // 管理员修改某树详情
  async updateTree(
    treeID: number,
    treeType: string,
    detailImage: Array<string>,
  ): Promise<AdminUpdateTreeImageResDto> {
    try {
      // 查询原来的树
      const oldTree: TreeEntity = await this.treeRepository.findOne({
        where: { id: treeID },
        relations: ['type_id'],
      });

      let newTreeTypeId = oldTree.type_id.id;

      // 树种是否改变
      if (treeType !== oldTree.type_id.scientific_name) {
        // 旧的减少
        await this.treeTypeRepository.update(
          { id: oldTree.type_id.id },
          {
            total: () => 'total - 1',
            remaining: () => 'remaining - 1',
          },
        );

        // 新的增加
        const nowTreeType: TreeTypeEntity =
          await this.treeTypeRepository.findOne({
            where: { scientific_name: treeType },
          });

        // 不存在树种
        if (!nowTreeType) {
          throw new NoTreeTypeException();
        }

        await this.treeTypeRepository.update(
          { id: nowTreeType.id },
          {
            total: () => 'total + 1',
            remaining: () => 'remaining + 1',
          },
        );

        // 改变树的 type_id
        await this.treeRepository.update(
          { id: treeID },
          { type_id: { id: nowTreeType.id } },
        );

        newTreeTypeId = nowTreeType.id;
      }

      // 更新 tree_images 表中的图片信息
      await this.treeImagesRepository.delete({ tree: { id: treeID } });

      const newImages = detailImage.map((item: string) => ({
        detailImage: item,
        tree: { id: treeID },
        type_id: { id: newTreeTypeId },
      }));

      await this.treeImagesRepository.insert(newImages);

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员修改树木详情成功',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 管理员删除某树
  async deleteTree(treeID: number): Promise<AdminDeleteTreeResDto> {
    try {
      const tree: any = await this.treeRepository.findOne({
        relations: ['type_id'],
        where: { id: treeID },
      });

      if (tree.isAdopted) {
        throw new BadTreeDeleteException();
      }

      // 删除tree_images表中的记录
      await this.treeImagesRepository.delete({ tree: { id: treeID } });
      // 删除tree表中的记录
      await this.treeRepository.delete({ id: treeID });
      // 更新treeType表的总数和剩余数量
      await this.treeTypeRepository.update(
        { id: tree.type_id.id },
        {
          total: () => 'total - 1',
          remaining: () => 'remaining - 1',
        },
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员删除树木成功',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 管理员获取树木筛选值
  async getTreeFilter(): Promise<AdminGetTreeFilterResDto> {
    try {
      const treeType: any = await this.treeTypeRepository.find();
      const treeFilter = treeType.map((item: any) => {
        return item.scientific_name;
      }) as Array<string>;

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取树木筛选值成功',
        data: treeFilter,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 批量增加树木 和对应的树木详情图片方法
   * @param differenceNum 需要添加的树木和图片的数量
   * @param treeTypeID 树木的类型ID
   * @returns 无返回值（Promise<void>）
   */
  async addTreesAndImage(
    differenceNum: number,
    treeTypeID: number,
  ): Promise<void> {
    // 准备需要插入的树木
    const treesToInsert: Array<any> = [];
    for (let i = 0; i < differenceNum; i++) {
      treesToInsert.push({
        type_id: { id: treeTypeID },
      });
    }
    // 批量插入到树木
    const trees: Array<any> = await this.treeRepository.save(treesToInsert);

    // 得到已插入树的id
    const allTreeID: Array<number> = trees.map((item) => {
      return item.id;
    });

    // 插入默认树木详情图片
    const treeImagesToInsert: Array<any> = [];
    for (let i = 0; i < differenceNum; i++) {
      treeImagesToInsert.push({
        tree: { id: allTreeID[i] },
        detailImage: this.configService.get<string>('DEFAULT_TREE_IMG'),
        type_id: { id: treeTypeID },
      });
    }

    // 批量插入树木图片
    await this.treeImagesRepository.insert(treeImagesToInsert);
  }
}
