// token/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ParseTokenDto } from 'src/modules/token/dto/token.dto';
import {
  BadAccessTokenException,
  NoAccessTokenException,
} from 'src/modules/token/exception/token.exception';

// token/guards/jwt-auth.guard.ts
/**
 * JwtAuthGuard 类实现了 NestJS 的 CanActivate 接口，用于保护JWT认证的路由。
 * 它通过验证JWT令牌来确定请求是否应该被允许通过。
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * 构造函数初始化JwtAuthGuard。
   * @param jwtService JWT服务，用于验证JWT令牌。
   * @param configService 配置服务，用于获取JWT密钥。
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从HTTP请求中获取请求对象
    const request = context.switchToHttp().getRequest();
    // 从请求头中提取Authorization信息
    const authHeader = request.headers.authorization;

    // 如果没有找到Authorization头，抛出异常
    if (!authHeader) {
      throw new NoAccessTokenException();
    }

    // 从Authorization头中提取JWT令牌
    const accessToken = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    try {
      // 使用JWT服务验证令牌，并将解码后的信息赋值给请求对象的user属性
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = decoded as ParseTokenDto;
      return true;
    } catch (error) {
      // 如果令牌验证失败，抛出异常
      throw new BadAccessTokenException();
    }
  }
}
