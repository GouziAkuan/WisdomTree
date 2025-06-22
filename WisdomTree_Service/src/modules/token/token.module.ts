import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/guards/token.guard';

/**
 * 身份令牌模块
 *
 * 该模块提供了身份令牌相关的控制器和服務
 * 它依赖于数据库模块和JWT模块来完成数据存储和身份验证。
 */
@Module({
  imports: [JwtModule],
  // 注册控制器
  controllers: [TokenController],
  // 注册服务
  providers: [TokenService, JwtAuthGuard],
  // 导出服务，以便其他模块可以使用
  exports: [JwtModule, TokenService],
})
export class TokenModule {}
