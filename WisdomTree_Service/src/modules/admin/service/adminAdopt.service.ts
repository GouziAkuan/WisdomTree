import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdoptionsEntity } from 'src/database/entities/adoptions.entity';
import { Repository } from 'typeorm';
import {
  AdminDelAdoptRes,
  AdminGetAdoptDataRes,
  AdminGetAdoptDetailRes,
  AdminGetAdoptRes,
  AdminPutAdoptDetailRes,
} from '../dto/adminAdoptRes';
import {
  BadAdminGetAdoptException,
  BadAdminPutAdoptException,
  NoAdoptException,
  NoUserTreeException,
} from '../exception/adminAdopt.exception';
import { UserEntity } from 'src/database/entities/user.entity';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { AdminAdoptUpdateService } from './adminAdoptUpdate.service';
import { TreeEntity } from 'src/database/entities/trees.entity';

@Injectable()
export class AdminAdoptService {
  constructor(
    private readonly adminAdoptUpdateService: AdminAdoptUpdateService,
    @InjectRepository(AdoptionsEntity)
    private readonly adoptRepository: Repository<AdoptionsEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
    @InjectRepository(TreeEntity)
    private readonly treeRepository: Repository<TreeEntity>,
  ) {}

  // 管理员获取领养表（分页）
  async getAdoptList(
    page: number,
    pagesize: number,
  ): Promise<AdminGetAdoptRes> {
    try {
      // 查询
      const [adoptList, total] = (await this.adoptRepository.findAndCount({
        relations: ['user', 'tree', 'type_id', 'tree.images'],
        skip: (page - 1) * pagesize,
        take: pagesize,
      })) as [AdoptionsEntity[], number];

      // 处理数据
      const data: Array<AdminGetAdoptDataRes> = adoptList.map(
        (item: AdoptionsEntity) => {
          const { username } = item.user;
          const { id, adoption_id, tree_type, wish, area } = item;
          const { scientific_name } = item.type_id;
          const detailImage = item.tree.images.map(
            (item: any) => item.detailImage,
          );

          return {
            id,
            username,
            scientific_name,
            adoption_id,
            area,
            tree_type,
            wish,
            detailImage,
          };
        },
      );
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员获取领养表成功',
        data: {
          page,
          pagesize,
          total,
          adoptList: data,
        },
      };
    } catch (error) {
      throw new BadAdminGetAdoptException();
    }
  }

  // 管理员获取某领养详情
  async getAdoptDetail(AdoptId: number): Promise<AdminGetAdoptDetailRes> {
    try {
      const data: AdoptionsEntity = await this.adoptRepository.findOne({
        where: { id: AdoptId },
        relations: ['user', 'tree', 'type_id', 'tree.images'],
      });

      const { username } = data.user;
      const { id, adoption_id, nickname, tree_type, wish, area } = data;
      const { scientific_name } = data.type_id;
      const detailImage = data.tree.images.map((item: any) => item.detailImage);
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员获取领养表详情成功',
        data: {
          id,
          username,
          scientific_name,
          adoption_id,
          nickname,
          area,
          tree_type,
          wish,
          detailImage,
        },
      };
    } catch (error) {
      throw new BadAdminGetAdoptException();
    }
  }

  // 管理员修改领养信息
  async updateAdopt(body: any): Promise<AdminPutAdoptDetailRes> {
    try {
      // 通过body.scientific_name和body.username分别获取数据库树表的id和用户表的id

      // 提交的新信息
      const { scientific_name, username, AdoptID, detailImage, ...remain } =
        body;

      // 旧的信息
      const AdoptData: AdoptionsEntity = await this.adoptRepository.findOne({
        where: {
          id: AdoptID,
        },
        relations: ['user', 'tree', 'type_id', 'tree.images'],
      });

      // 旧的用户和树类
      const oldUserID = AdoptData.user.id;
      const oldTreeTypeID = AdoptData.type_id.id;
      const oldTreeID = AdoptData.tree.id;
      // 新的树类和用户
      const [newUser, newTreeType] = await Promise.all([
        this.userRepository.findOne({ where: { username } }),
        this.treeTypeRepository.findOne({ where: { scientific_name } }),
      ]);

      // 判断用户和树是否存在
      if (!newUser || !newTreeType) {
        throw new NoUserTreeException();
      }

      const newUserID = newUser.id;
      const newTreeTypeID = newTreeType.id;

      // 只要树变了
      if (oldTreeTypeID !== newTreeTypeID) {
        // 更新树
        const { adoptionID, newTreeID } =
          await this.adminAdoptUpdateService.updateTree(
            oldTreeID,
            oldTreeTypeID,
            newTreeTypeID,
          );
        // 更新详情图片
        await this.adminAdoptUpdateService.updateTreeImage(
          newTreeID,
          detailImage,
          newTreeTypeID,
        );
        // 更新领养记录
        await this.adoptRepository.update(
          { id: AdoptID }, //更新条件
          {
            ...remain,
            adoption_id: adoptionID,
            user: { id: newUserID },
            tree: { id: newTreeID },
            type_id: { id: newTreeTypeID },
          }, //更新数据
        );
      }
      //用户变了，树没变
      else if (oldUserID === newUserID && oldTreeTypeID !== newTreeTypeID) {
        // 更新详情图片
        await this.adminAdoptUpdateService.updateTreeImage(
          oldTreeID,
          detailImage,
          newTreeTypeID,
        );
        // 更新领养记录
        await this.adoptRepository.update(
          { id: AdoptID }, //更新条件
          {
            ...remain,
            user: { id: newUserID },
          }, //更新数据
        );
      }
      // 树和用户都没变
      else {
        // 更新详情图片
        await this.adminAdoptUpdateService.updateTreeImage(
          oldTreeID,
          detailImage,
          newTreeTypeID,
        );
        await this.adoptRepository.update(
          { id: AdoptID }, //更新条件
          {
            ...remain,
          }, //更新数据
        );
      }

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员更新某领养成功',
      };

      // 如果树id相较于原来发生了变化，则编号和树表的树数量需要重新处理
    } catch (error) {
      throw new BadAdminPutAdoptException();
    }
  }

  // 管理员删除某领养
  async deleteAdopt(AdoptID: number): Promise<AdminDelAdoptRes> {
    try {
      // 查找领养记录
      const adoptData: AdoptionsEntity = await this.adoptRepository.findOne({
        where: { id: AdoptID },
        relations: ['tree', 'type_id'],
      });
      if (!adoptData) {
        throw new NoAdoptException();
      }
      // 删除领养记录
      await this.adoptRepository.delete({ id: AdoptID });
      // 更新tree表的状态
      await this.treeRepository.update(
        {
          id: adoptData.tree.id,
        },
        {
          isAdopted: false,
        },
      );
      // 更新treeType表的数量
      await this.treeTypeRepository.update(
        {
          id: adoptData.type_id.id,
        },
        {
          remaining: () => 'remaining + 1',
        },
      );
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '管理员删除领养记录成功',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
