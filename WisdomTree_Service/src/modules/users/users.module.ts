import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from '../token/token.module';
import { HttpModule } from '@nestjs/axios';

/**
 * 用户模块
 *
 * 该模块提供了用户相关的控制器和服務，包括用户注册、登录等功能。
 * 它依赖于数据库模块和JWT模块来完成数据存储和身份验证。
 */
@Module({
  imports: [DatabaseModule, TokenModule, HttpModule],

  // 注册控制器
  controllers: [UsersController],

  // 注册服务
  providers: [UsersService],
})
export class UsersModule {}
