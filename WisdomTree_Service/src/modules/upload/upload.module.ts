import { Module, OnModuleInit } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadController } from './upload.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    // 配置 MulterModule 异步注册，用于处理文件上传
    MulterModule.registerAsync({
      imports: [ConfigModule], // 引入 ConfigModule 以便使用配置服务
      inject: [ConfigService], // 注入 ConfigService
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          // 配置文件存储方式为 diskStorage
          destination: configService.get<string>('STATIC_FILES_PATH'), // 文件存储的目录
          filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop(); // 获取文件扩展名
            const filename = `${uuidv4()}.${fileExtension}`; // 生成唯一的文件名
            cb(null, filename); // 将生成的文件名传递给回调
          },
        }),
      }),
    }),
  ],
  controllers: [UploadController], // 注册控制器
  providers: [UploadService], // 注册服务
  exports: [UploadService], // 导出服务，以便其他模块可以注入它
})
export class UploadModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  /**
   * 在模块初始化时执行的逻辑。
   * 确保上传目录存在，如果不存在则创建它。
   */
  onModuleInit() {
    // 构建上传目录的完整路径
    const uploadDir = join(
      __dirname,
      '..',
      this.configService.get<string>('STATIC_FILES'),
    );

    // 检查目录是否存在
    if (!existsSync(uploadDir)) {
      // 如果目录不存在，则创建它
      mkdirSync(uploadDir, { recursive: true });
    }
  }
}
