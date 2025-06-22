import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { Repository } from 'typeorm';
import {
  AdminAddTreeTypeReqDto,
  AdminDeleteTreeTypeReqDto,
  AdminTreeTypeInfoReqDto,
  AdminTreeTypeListResDto,
  AdminUpadtTreeTypeReqDto,
} from '../dto/adminTreeTypeRes.dto';
import {
  TreeTypeDeleteException,
  TreeTypeDuplicateException,
} from '../exception/adminTreeType.exception';
import {
  AdminAddTreeTypeDto,
  AdminUpdateTreeTypeDto,
} from '../dto/adminTreeType.dto';
import { TreeEntity } from 'src/database/entities/trees.entity';
import { TreeImagesEntity } from 'src/database/entities/treeImages.entity';
import { AdminTreeService } from './adminTree.service';
import { BadDifference } from '../exception/adminTree.exception';

@Injectable()
export class AdminTreeTypeService {
  constructor(
    private readonly adminTreeService: AdminTreeService,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
    @InjectRepository(TreeEntity)
    private readonly treeRepository: Repository<TreeEntity>,
    @InjectRepository(TreeImagesEntity)
    private readonly treeImagesRepository: Repository<TreeImagesEntity>,
  ) {}

  // 管理员创建树种类
  async addTreeType(
    TreeTypeInfo: AdminAddTreeTypeDto,
  ): Promise<AdminAddTreeTypeReqDto> {
    try {
      // 创建新树种
      const NewTreeType = await this.treeTypeRepository.save({
        ...TreeTypeInfo,
        remaining: TreeTypeInfo.total as number,
      });

      // 在tree表中创建数量total相同种类的树 以及在treeImage表中创建树对应的详情图片
      await this.adminTreeService.addTreesAndImage(
        TreeTypeInfo.total as number,
        NewTreeType.id as number,
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '创建树类及其树木成功',
      };
    } catch (error) {
      // 检查错误是否是由于唯一性约束违反
      if (error.code === 'ER_DUP_ENTRY') {
        // 这个错误码通常是MYSQL中唯一性约束违反的错误码
        throw new TreeTypeDuplicateException();
      }
      console.log(error);
    }
  }

  // 管理员获取树种类列表（分页）
  async getTreeTypeList(
    page: number,
    pagesize: number,
  ): Promise<AdminTreeTypeListResDto> {
    try {
      // 分页查询
      // 根据分页参数获取树的类型列表及总数量
      const [treeTypeList, count]: Array<any> =
        await this.treeTypeRepository.findAndCount({
          // 跳过的结果数量，用于分页处理，根据当前页码和数据数量计算得出
          skip: ((page - 1) * pagesize) as number,
          // 每次查询获取的结果数量，即数据数量
          take: pagesize as number,
        });

      treeTypeList.map((item: any) => {
        // 删除时间戳
        delete item.updated_at;
        delete item.created_at;
      });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取树种类列表成功',
        data: {
          page,
          pagesize,
          total: count as number,
          treeTypeList,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  // 管理员修改树种类信息
  async updateTreeType(
    body: AdminUpdateTreeTypeDto,
  ): Promise<AdminUpadtTreeTypeReqDto> {
    try {
      // 解构请求体中的参数
      const { treeTypeID, ...remain } = body;

      // 旧树种信息
      const treeTypeInfo = await this.treeTypeRepository.findOne({
        where: { id: treeTypeID as number },
      });

      // 总数剩余新旧差值不一致（擅自只更改剩余数量） 不允许修改
      if (
        treeTypeInfo.total - treeTypeInfo.remaining !==
        remain.total - remain.remaining
      ) {
        throw new BadDifference();
      }

      // 若新树木数量大于旧树木数量，则新增树木和树木图片
      if (remain.total > treeTypeInfo.total) {
        // 在tree表中创建数量total相同种类的树 以及在treeImage表中创建树对应的详情图片
        await this.adminTreeService.addTreesAndImage(
          (remain.total - treeTypeInfo.total) as number,
          treeTypeInfo.id as number,
        );
      }
      // 若新树木数量小于旧树木数量，则删除相应数量的未领养的树木
      else if (remain.total < treeTypeInfo.total) {
        for (let i = 0; i < treeTypeInfo.total - remain.total; i++) {
          // 查询出一个未领养的树id
          const tree = await this.treeRepository.findOne({
            where: {
              type_id: { id: treeTypeID },
              isAdopted: false,
            },
          });

          // 删除其对应树木图片
          await this.treeImagesRepository.delete({
            tree: { id: tree.id },
          });

          // 删除这个树木
          await this.treeRepository.delete({
            id: tree.id,
            isAdopted: false,
          });
        }
      }

      // 最后更新tree表中的树木信息
      await this.treeTypeRepository.update(
        {
          id: treeTypeID as number, // 根据树木ID查找要更新的记录
        },
        {
          ...remain, // 更新树木的其他信息
        },
      );

      // 返回成功的响应
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员修改树木种类信息及其树木成功',
      };
    } catch (error) {
      // 检查错误是否是由于唯一性约束违反
      if (error.code === 'ER_DUP_ENTRY') {
        // 这个错误码通常是MYSQL中唯一性约束违反的错误码
        throw new TreeTypeDuplicateException();
      }
      console.log(error);
      // 捕获并处理异常，抛出自定义异常以表示更新失败
      throw error;
    }
  }

  // 管理员删除树种
  async deleteTreeType(treeTypeID: number): Promise<AdminDeleteTreeTypeReqDto> {
    try {
      // 旧树种信息
      const treeTypeInfo = await this.treeTypeRepository.findOne({
        where: { id: treeTypeID as number },
      });

      // 判断是否有已领养树木
      const treeCount = treeTypeInfo.total === treeTypeInfo.remaining;

      if (!treeCount) {
        throw new TreeTypeDeleteException();
      }

      // 删除树木图片
      await this.treeImagesRepository.delete({
        type_id: { id: treeTypeID },
      });

      // 删除树木
      await this.treeRepository.delete({
        type_id: { id: treeTypeID },
      });

      // 删除树种
      await this.treeTypeRepository.delete({ id: treeTypeID });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '删除树类及其树木成功',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 管理员获取树种类信息
  async getTreeTypeInfo(treeTypeID: number): Promise<AdminTreeTypeInfoReqDto> {
    try {
      //查询
      const treeTypeInfo = await this.treeTypeRepository.findOne({
        where: { id: treeTypeID as number },
      });

      // 删除时间戳
      delete treeTypeInfo.updated_at;
      delete treeTypeInfo.created_at;

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取树类信息成功',
        data: treeTypeInfo,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
