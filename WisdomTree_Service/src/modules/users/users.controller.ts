import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto, UserLoginDto, UpdateInfoDto } from './dto/users.dto';
import {
  UserLoginResponseDto,
  UserCreateResponseDto,
  UpdateInfoResponseDto,
} from './dto/usersResponse.dto';
import { JwtAuthGuard } from 'src/common/guards/token.guard';

@Controller('user')
export class UsersController {
  /**
   * 构造函数，用于依赖注入。
   * @param usersservice 注入的 UsersService 实例，用于处理用户相关的业务逻辑。
   */
  constructor(private readonly usersservice: UsersService) {}

  // 用户创建
  @Post('create')
  async create(
    @Body() userCreateData: UsersCreateDto,
  ): Promise<UserCreateResponseDto> {
    // 调用 UsersService 的 create 方法处理用户创建，并返回处理结果
    return await this.usersservice.create(userCreateData);
  }

  // 用户登录
  @Post('login')
  async login(
    @Body() userLoginData: UserLoginDto,
  ): Promise<UserLoginResponseDto> {
    return await this.usersservice.login(userLoginData);
  }

  // 查询用户信息
  @Get('getUserInfo')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Request() req: any) {
    return await this.usersservice.getUserInfo(req.user.id);
  }

  // 修改用户信息
  @Put('updateInfo')
  @UseGuards(JwtAuthGuard)
  async updateInfo(
    @Request() req: any,
    @Body() userUpdateData: UpdateInfoDto,
  ): Promise<UpdateInfoResponseDto> {
    return await this.usersservice.updateInfo(req.user.id, userUpdateData);
  }
}
