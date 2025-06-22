import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminCreateDto, AdminLoginDto } from '../dto/admin.dto';
import { AdminCreateResDto, AdminLoginResDto } from '../dto/adminRes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import AdminUserEntity from 'src/database/entities/adminUser.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PayloadDto } from 'src/modules/token/dto/token.dto';
import { TokenService } from 'src/modules/token/token.service';
import { NoAdminException } from '../exception/admin.exception';
import { BadPasswordException } from 'src/modules/users/exception/user.exception';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminRepository: Repository<AdminUserEntity>,
    private readonly tokenService: TokenService,
  ) {}

  // 创建管理员
  async create(body: AdminCreateDto): Promise<AdminCreateResDto> {
    // 加密密码
    const hashedPassword: string = await bcrypt.hash(body.password, 10);
    // 创建新管理员
    await this.adminRepository.insert({
      ...body,
      password: hashedPassword,
      role: 'admin',
    });

    // 返回创建成功的响应
    return {
      status: HttpStatus.OK,
      code: 0,
      message: '创建成功',
    };
  }

  // 管理员登录
  async login(body: AdminLoginDto): Promise<AdminLoginResDto> {
    // 从数据库中查找匹配的管理员
    const adminDatabase: any = await this.adminRepository.findOne({
      where: {
        username: body.username,
      },
    });

    // 如果没有找到管理员，抛出异常
    if (!adminDatabase) {
      throw new NoAdminException();
    } else {
      // 比较管理员提供的密码与数据库中存储的加密密码
      const isMatch: boolean = await bcrypt.compare(
        body.password,
        adminDatabase.password,
      );

      // 如果密码匹配，生成访问令牌和刷新令牌
      if (isMatch) {
        const payload: PayloadDto = {
          id: adminDatabase.id,
          role: adminDatabase.role,
        };

        // 生成访问令牌
        const accessToken = await this.tokenService.getAccessToken(payload);

        // 生成刷新令牌
        const refreshToken = await this.tokenService.getRefreshToken(payload);

        // 返回登录成功的响应
        return {
          status: HttpStatus.OK,
          code: 0,
          message: '登录成功',
          data: {
            accessToken,
            refreshToken,
          },
        };
      } else {
        // 如果密码不匹配，抛出异常
        throw new BadPasswordException();
      }
    }
  }
}
