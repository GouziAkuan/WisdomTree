import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AdoptTreeNumberRequestDto,
  AdoptTreeRequestDto,
  GetTreeDetailRequestDto,
  GetTreeRequestDto,
  GetUserAdoptTreeDetailRequestDto,
  GetUserAdoptTreeRequestDto,
} from './dto/treeRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeEntity } from 'src/database/entities/trees.entity';
import { TreeImagesEntity } from 'src/database/entities/treeImages.entity';
import { AdoptionsEntity } from 'src/database/entities/adoptions.entity';
import { Repository } from 'typeorm';
import { AdoptTreeDto, PaginateQueryDto } from './dto/tree.dto';
import {
  BadAdoptException,
  BadGetUserAdoptTreeDetail,
  NoTreeException,
  NoTreeNumException,
} from './exception/tree.exception';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import dayjs from 'dayjs';

@Injectable()
export class TreeService {
  constructor(
    @InjectRepository(TreeEntity)
    private readonly treeRepository: Repository<TreeEntity>,
    @InjectRepository(TreeImagesEntity)
    private readonly treeImagesRepository: Repository<TreeImagesEntity>,
    @InjectRepository(AdoptionsEntity)
    private readonly adoptionsRepository: Repository<AdoptionsEntity>,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  // 获取树木列表
  async getTree(
    userId: number,
    query: PaginateQueryDto,
  ): Promise<GetTreeRequestDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      const { page, pageSize } = query;
      const [records, total] = await this.treeTypeRepository.findAndCount({
        select: {
          id: true,
          scientific_name: true,
          total: true,
          remaining: true,
          energy: true,
          avatar: true,
        },
        order: { id: 'ASC' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取成功',
        data: {
          userEnergy: user?.energy ?? 0,
          total,
          page,
          pageSize,
          treeType: records,
        },
      };
    } catch (error) {
      console.log(error);
      // 日志省略
      throw new NoTreeException();
    }
  }

  // 获取某树木详情信息
  async getTreeDetail(
    treeTypeID: number,
    userId: number,
  ): Promise<GetTreeDetailRequestDto> {
    try {
      // 查询用户总能量
      const user: UserEntity = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      // 在树木种类表查找对应的信息
      const tree: TreeTypeEntity = await this.treeTypeRepository.findOne({
        where: {
          id: treeTypeID,
        },
      });
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取成功',
        data: {
          ...tree,
          userEnergy: user.energy,
        },
      };
    } catch (error) {
      console.log(error);
      throw new NoTreeException();
    }
  }

  // 领养树木
  async adoptTree(
    adoptInfo: AdoptTreeDto,
    userId: number,
  ): Promise<AdoptTreeRequestDto> {
    const queryRunner =
      this.adoptionsRepository.manager.connection.createQueryRunner();

    try {
      // 先获取用户和树种信息（事务外查询）
      const [user, treeType] = await Promise.all([
        this.userRepository.findOne({ where: { id: userId } }),
        this.treeTypeRepository.findOne({
          where: { id: adoptInfo.treeTypeID },
        }),
      ]);

      // 能量校验
      if (user.energy < treeType.energy) {
        throw new HttpException('能量不足，无法领养', HttpStatus.BAD_REQUEST);
      }

      // 开始事务
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 养树木数量处理
      const adoptionTreeInfo: AdoptTreeNumberRequestDto =
        await this.adoptTreeNumber(adoptInfo.treeTypeID);
      // 生成独特的领养编号
      const adoptionID = await this.getAdoptionsID(adoptionTreeInfo);

      // 插入领养信息
      await this.adoptionsRepository.insert({
        nickname: adoptInfo.nickName,
        tree_type: adoptInfo.treeType,
        wish: adoptInfo.wish,
        area: adoptInfo.area,
        adoption_id: adoptionID,
        user: { id: userId },
        tree: { id: adoptionTreeInfo.treeId },
        type_id: { id: adoptInfo.treeTypeID },
      });

      // 扣除用户能量
      await this.userRepository.update(
        { id: userId },
        { energy: user.energy - treeType.energy },
      );

      // 提交事务
      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '领养成功',
        data: {
          adoptionID,
          nickName: adoptInfo.nickName,
          treeType: adoptInfo.treeType,
        },
      };
    } catch (error) {
      // 事务回滚
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error; // 直接传递已有异常
      }
      console.log(error);
      throw new BadAdoptException();
    } finally {
      // 释放事务
      await queryRunner.release();
    }
  }

  // 生成独特的领养编号
  async getAdoptionsID(
    adoptionNum: AdoptTreeNumberRequestDto,
  ): Promise<string> {
    try {
      const now = dayjs();

      // 使用dayjs格式化日期时间
      const datePart = now.format('YYYYMMDDHHmmss');
      const numPart = String(adoptionNum.total - adoptionNum.remaining);

      return datePart + numPart;
    } catch (error) {
      console.log(error);
      throw new NoTreeException();
    }
  }

  // 领养树木数量处理（实现将树isAdopted字段为true，treeType表更新）
  async adoptTreeNumber(
    treeTypeID: number,
  ): Promise<AdoptTreeNumberRequestDto> {
    // 验证数量是否够领取
    const tree: any = await this.treeTypeRepository.findOne({
      where: {
        id: treeTypeID,
      },
    });
    if (tree.remaining !== 0) {
      // 从tree表找到type_id=treeId的树，并且isAdopted字段为false的信息，随机选取一个标为true并更新
      const availableTree = await this.treeRepository.findOne({
        where: {
          type_id: { id: treeTypeID },
          isAdopted: false,
        },
      });
      await this.treeRepository.update(
        { id: availableTree.id },
        {
          isAdopted: true,
        },
      );
      // 领养树木数量减一
      tree.remaining -= 1;
      // 更新treetype表
      await this.treeTypeRepository.update(
        { id: treeTypeID },
        {
          remaining: tree.remaining,
        },
      );
      return {
        treeId: availableTree.id,
        total: tree.total,
        remaining: tree.remaining,
      };
    } else {
      throw new NoTreeNumException();
    }
  }

  // 获取用户领养树木信息
  async getUserTree(userId: number): Promise<GetUserAdoptTreeRequestDto> {
    // 在领养表查找全部领养信息，并且通过外键tree_id拿到每个记录对应的树信息
    const adoptions: any = await this.adoptionsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['tree', 'tree.type_id'], // 显示 外键 tree 相关字段
    });
    // 处理adoptions
    const data = adoptions.map((item: any) => {
      const { id, tree_type } = item;
      const { avatar, scientific_name } = item.tree.type_id;
      // 返回处理后的对象
      return {
        id,
        tree_type,
        avatar,
        scientific_name,
      };
    });
    return {
      status: HttpStatus.OK,
      code: 0,
      message: '获取成功',
      data,
    };
  }

  // 获取用户领养树木详情
  async getUserTreeDetail(
    id: number,
  ): Promise<GetUserAdoptTreeDetailRequestDto> {
    try {
      // 在领养表通过记录id和用户id拿到对应的用户领养记录信息，并且通过外键tree_id拿到每个记录对应的树信息
      const adoptions: any = await this.adoptionsRepository.findOne({
        where: {
          id,
        },
        relations: ['tree', 'tree.type_id'],
      });
      // 根据拿到的tree表的id去拿treeimage表的详情图片
      const detailImage = await this.treeImagesRepository.find({
        where: {
          tree: { id: adoptions.tree.id },
        },
      });
      // 删除字段
      delete adoptions.updated_at;
      // 处理adoptions.tree.type_id
      const treeInfo = adoptions.tree.type_id;
      delete treeInfo.created_at;
      delete treeInfo.updated_at;
      delete adoptions.tree;
      // 处理data
      const data = {
        ...adoptions,
        ...treeInfo,
        detailImage: detailImage.map((item) => item.detailImage),
      };
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '获取成功',
        data,
      };
    } catch (error) {
      console.log(error);
      throw new BadGetUserAdoptTreeDetail();
    }
  }
}
