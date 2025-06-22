import { Controller, Headers, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshAccessResponseDto } from './dto/tokenResponse';

@Controller('auth')
export class TokenController {
  constructor(private tokenservice: TokenService) {}

  // 刷新Accesstoken
  @Get('refreshAccess')
  async refreshAccessToken(
    @Headers('authorization') refreshToken: string,
  ): Promise<RefreshAccessResponseDto> {
    return this.tokenservice.refreshAccessToken(refreshToken);
  }
}
