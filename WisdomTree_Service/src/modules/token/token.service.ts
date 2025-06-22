import { HttpStatus, Injectable } from '@nestjs/common';
import { ParseTokenDto, PayloadDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRefreshTokenException } from './exception/token.exception';
import { RefreshAccessResponseDto } from './dto/tokenResponse';

/**
 * 提供令牌生成和验证服务。
 */
@Injectable()
export class TokenService {
  /**
   * 构造函数初始化 JWT 服务和配置服务。
   * @param jwtservice JWT 服务，用于生成和验证令牌。
   * @param configService 配置服务，用于获取 JWT 密钥和令牌过期时间等配置信息。
   */
  constructor(
    private jwtservice: JwtService,
    private configService: ConfigService,
  ) {}
  /**
   * 生成访问令牌。
   * @param payload 令牌负载，包含用户信息等。
   * @returns 生成的访问令牌。
   */
  // 生成 Access Token
  async getAccessToken(payload: PayloadDto | ParseTokenDto): Promise<string> {
    // 解构只要id和role
    const { id, role } = payload;
    const newPayload: PayloadDto = { id, role };
    const accessToken: string = await this.jwtservice.signAsync(newPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
    });
    return accessToken;
  }

  /**
   * 生成刷新令牌。
   * @param payload 令牌负载，包含用户信息等。
   * @returns 生成的刷新令牌。
   */
  // 生成 Refresh Token
  async getRefreshToken(payload: PayloadDto): Promise<string> {
    const refreshToken: string = await this.jwtservice.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
    });
    return refreshToken;
  }

  /**
   * 验证刷新令牌的有效性。
   * @param refreshToken 刷新令牌。
   * @returns 如果令牌有效，返回负载信息；否则抛出异常。
   */
  // 验证 Refresh Token
  async verifyRefreshToken(refreshToken: string): Promise<PayloadDto> {
    try {
      const payload: PayloadDto = await this.jwtservice.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      return payload;
    } catch (error) {
      throw new BadRefreshTokenException();
    }
  }

  /**
   * 刷新访问令牌。
   * @param refreshToken 刷新令牌。
   * @returns 返回新的访问令牌和相关信息。
   */
  // 刷新Access Token并验证Refresh Token
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshAccessResponseDto> {
    const token: string = refreshToken?.startsWith('Bearer ')
      ? refreshToken.substring(7)
      : refreshToken;
    const payload: PayloadDto = await this.verifyRefreshToken(token);
    const accessToken: string = await this.getAccessToken(payload);
    return {
      status: HttpStatus.OK,
      code: 0,
      message: 'accessToken 刷新成功',
      data: { accessToken },
    };
  }
}
