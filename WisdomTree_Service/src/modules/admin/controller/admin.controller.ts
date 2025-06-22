import { Body, Controller, Post } from '@nestjs/common';
import { AdminCreateDto, AdminLoginDto } from '../dto/admin.dto';
import { AdminCreateResDto, AdminLoginResDto } from '../dto/adminRes.dto';
import { AdminService } from '../service/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  // 管理员相关操作
  // 创建管理员
  @Post('create')
  async create(@Body() body: AdminCreateDto): Promise<AdminCreateResDto> {
    return await this.adminService.create(body);
  }

  // 管理员登录
  @Post('login')
  async login(@Body() body: AdminLoginDto): Promise<AdminLoginResDto> {
    return await this.adminService.login(body);
  }
}
