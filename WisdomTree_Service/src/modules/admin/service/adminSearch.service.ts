import { HttpStatus, Injectable } from '@nestjs/common';
import {
  AdminSearchTreeTypeRes,
  AdminSearchUserRes,
} from '../dto/adminSearchRes';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeTypeEntity } from 'src/database/entities/treeType.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class AdminSearchService {
  constructor(
    @InjectRepository(TreeTypeEntity)
    private readonly treeTypeRepository: Repository<TreeTypeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 搜索树种
  async searchTreeType(treeTypeInput: string): Promise<AdminSearchTreeTypeRes> {
    // 创建查询生成器 为了更加复杂的操作
    const queryBuilder = this.treeTypeRepository.createQueryBuilder('treeType');
    // 利用查询生成器创建模糊查询，按照树类型名称包含的关键词进行匹配
    // 没查询到回返回空数组
    const treeTypes: Array<TreeTypeEntity> = await queryBuilder
      // 模糊查询树类型名称
      .where('treeType.scientific_name LIKE :scientific_name', {
        scientific_name: `%${treeTypeInput}%`,
      })
      // 按照总数降序排列结果
      .orderBy('treeType.total', 'DESC')
      // 只取前10条记录返回
      .take(10)
      .getMany();

    const searchResult: Array<string> = treeTypes.map(
      (item: TreeTypeEntity) => {
        const { scientific_name } = item;
        return scientific_name;
      },
    );

    return {
      status: HttpStatus.OK,
      code: 0,
      message: 'success',
      data: searchResult,
    };
  }

  // 搜索用户
  async searchUser(userInput: string): Promise<AdminSearchUserRes> {
    // 创建查询生成器
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const users: Array<UserEntity> = await queryBuilder
      // 模糊查询用户昵称
      .where('user.username LIKE :username', { username: `%${userInput}%` })
      // 按照用户注册时间降序排列结果
      .orderBy('user.created_at', 'DESC')
      // 只取前10条记录返回
      .take(10)
      .getMany();

    const searchResult: Array<string> = users.map((item: UserEntity) => {
      const { username } = item;
      return username;
    });

    return {
      status: HttpStatus.OK,
      code: 0,
      message: 'success',
      data: searchResult,
    };
  }
}
