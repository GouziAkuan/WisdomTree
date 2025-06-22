import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from '../token/token.module';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';

/**
 * 树模块
 *
 * 该模块负责树相关功能。
 * 它通过导入数据库模块和令牌模块来利用它们的功能。
 * 控制器处理HTTP请求，而服务则提供业务逻辑。
 */

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [TreeController],
  providers: [TreeService],
  exports: [TreeService],
})
export class TreeModule {}
