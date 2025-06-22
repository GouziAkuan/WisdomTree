import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { ReqDto } from 'src/modules/token/dto/token.dto';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 先执行 `JwtAuthGuard` 的 canActivate 方法，进行 JWT 认证
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    // 获取当前 HTTP 请求的 request 对象 已经有解密后的用户信息
    const request: ReqDto = context.switchToHttp().getRequest();

    // 额外校验：必须是 admin
    if (request.user.role !== 'admin') {
      throw new HttpException('无权访问', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
