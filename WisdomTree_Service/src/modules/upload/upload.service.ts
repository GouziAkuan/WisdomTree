import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConvertResDto,
  DeleteResFile,
  UploadResDto,
} from './dto/uploadres.dto';
import {
  DeleteFileException,
  InvalidFileException,
  UploadSizeException,
} from './exception/upload.exception';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  /**
   * 处理文件上传，生成文件的访问路径。
   * @param file 上传的文件对象
   * @returns 返回一个包含文件信息和状态的对象
   */
  uploadFile(file: Express.Multer.File): UploadResDto {
    // 文件大于5mb抛出错误
    if (file.size > 5 * 1024 * 1024) {
      throw new UploadSizeException();
    } else {
      // 从配置服务中获取静态文件的 URL
      const staticFilesUrl: string = this.configService.get<string>('NEST_URL');
      // 从配置服务中获取静态文件的目录
      const staticFiles: string =
        this.configService.get<string>('STATIC_FILES');
      // 构建文件的完整 URL
      const fileUrl: string = `${staticFilesUrl}${staticFiles}/${file.filename}`;

      // 返回包含文件信息和状态的对象
      return {
        status: HttpStatus.OK, // 设置 HTTP 状态码为 200 OK
        code: 0, // 状态码，通常用于业务逻辑中的成功标识
        filename: file.filename, // 上传文件后的文件名
        path: fileUrl, // 文件的完整访问路径
      };
    }
  }

  /**
   * 删除静态文件
   * @param fileUrl 文件的完整 URL
   * @returns 返回删除操作的状态
   */
  async deleteFile(fileUrl: string): Promise<DeleteResFile> {
    try {
      const mr = await this.deleteMethod(fileUrl);
      if (mr) {
        return {
          status: HttpStatus.OK,
          code: 1,
          message: '文件删除成功',
        };
      } else {
        return {
          status: HttpStatus.OK,
          code: 1,
          message: '响应成功，图片为默认图片，无需删除',
        };
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在
        throw new InvalidFileException();
      } else {
        // 删除文件失败或其他错误
        throw new DeleteFileException();
      }
    }
  }

  // 抽离删除逻辑，为了其他模块更好调用
  async deleteMethod(fileUrl: string): Promise<boolean> {
    const mrtx = this.configService.get<string>('DEFAULT_AVATAR');
    const mrtree = this.configService.get<string>('DEFAULT_TREE_IMG');

    // URL路径解析
    const url = new URL(fileUrl);
    const fullPath = url.pathname; // 获取路径部分如 "/static/filename.jpg"

    // 判断是否为默认图片（需要同步更新默认图片的匹配逻辑）
    if (fileUrl !== mrtx && fileUrl !== mrtree) {
      const staticFilesPath =
        this.configService.get<string>('STATIC_FILES_PATH');

      // 正确解析文件名
      const fileName = fullPath.split('/').pop(); // 从路径中获取文件名
      // 准备删除的图片路径
      const filePath = join(staticFilesPath, fileName);

      try {
        await fsPromises.access(filePath);
        await fsPromises.unlink(filePath);
        return true;
      } catch (error) {
        // 若文件不存在
        if (error.code === 'ENOENT') {
          return false;
        }
        throw error;
      }
    }
    return false;
  }

  // 转换base64
  async convertToBase64(filename: string): Promise<ConvertResDto> {
    try {
      return {
        status: HttpStatus.OK,
        code: 0,
        message: '文件转换成功',
        base64: await this.imageToBase64(filename),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('文件转换失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 转换base64独立方法
  async imageToBase64(filename: string): Promise<string> {
    try {
      const staticFilesPath =
        this.configService.get<string>('STATIC_FILES_PATH');
      const filePath = join(staticFilesPath, filename);

      // 读取文件
      const fileBuffer = await fsPromises.readFile(filePath);

      // 转换为Base64
      const base64String = fileBuffer.toString('base64');

      // 构建完整的Base64数据
      const data = `data:image/${filename.split('.').pop()};base64,${base64String}`;

      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new InvalidFileException();
      }
      throw new Error('文件转换失败');
    }
  }
}
