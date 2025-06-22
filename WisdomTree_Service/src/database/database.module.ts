import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { createConnection } from 'mysql2/promise'; // 导入 mysql2/promise
import { UserEntity } from './entities/user.entity';
import { TreeEntity } from './entities/trees.entity';
import { TreeImagesEntity } from './entities/treeImages.entity';
import { AdoptionsEntity } from './entities/adoptions.entity';
import AdminUserEntity from './entities/adminUser.entity';
import { TreeTypeEntity } from './entities/treeType.entity';
import { PostEntity } from './entities/community/post.entity';
import { CollectEntity } from './entities/collect.entity';
import { CommentEntity } from './entities/community/comment.entity';
import { LikeEntity } from './entities/community/likes.entity';
import { ActivityEntity } from './entities/activity.entity';
import { EnergyEntity } from './entities/energy.entity';

/**
 * 数据库模块，用于配置和初始化TypeORM以连接到数据库。
 * 该模块还导出TypeOrmModule，以便其他模块可以使用实体。
 */
@Module({
  imports: [
    /**
     * 配置TypeORM模块以异步方式初始化数据库连接。
     * 使用配置模块（ConfigModule）提供的配置服务（ConfigService）来动态获取数据库连接参数。
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = +configService.get<number>('DB_PORT');
        const username = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_DATABASE');

        // 检查并创建数据库
        const connection = await createConnection({
          host,
          port,
          user: username,
          password,
        });

        await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${database}\`;`,
        );
        await connection.end();

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          synchronize: true, // 在开发时可以使用，生产环境建议设为 false
          autoLoadEntities: true,
        };
      },
    }),
    /**
     * 注册实体模块，使得TypeORM可以管理这些实体。
     */
    TypeOrmModule.forFeature([
      UserEntity,
      TreeEntity,
      TreeImagesEntity,
      AdoptionsEntity,
      AdminUserEntity,
      TreeTypeEntity,
      PostEntity,
      CollectEntity,
      CommentEntity,
      LikeEntity,
      ActivityEntity,
      EnergyEntity,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
