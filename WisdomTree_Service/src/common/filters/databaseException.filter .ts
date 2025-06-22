import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * 数据库异常过滤器，用于处理数据库操作失败。
 * 捕获 TypeORM 的 QueryFailedError 异常，并提供自定义的错误响应。
 */
@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  /**
   * 处理捕获到的异常。
   * @param exception 捕获到的 QueryFailedError 异常。
   * @param host ArgumentsHost 对象，提供访问请求和响应对象的能力。
   */
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取底层数据库驱动程序的错误信息
    const driverError = exception.driverError as any; // 使用 any 类型来临时处理
    const errorCode = driverError?.code; // 使用 optional chaining 访问 code 属性
    const errorMessage = driverError?.sqlMessage; // 获取错误消息

    let message = '数据库操作失败'; // 默认错误消息
    let errors = null; // 默认错误字段

    // 检查是否是重复条目的错误
    if (errorCode === 'ER_DUP_ENTRY') {
      console.log(errorMessage); // 打印错误消息以供调试
      // 根据错误消息中的索引名称来确定具体的重复字段
      if (errorMessage.includes('users.IDX_fe0bb3f6520ee0469504521e71')) {
        // 如果错误消息包含用户名字段的索引名称
        message = '用户名已存在，请选择其他用户名。'; // 自定义错误消息
        errors = { username: '用户名已存在' }; // 自定义错误字段
      } else if (
        errorMessage.includes('users.IDX_a000cca60bcf04454e72769949')
      ) {
        // 如果错误消息包含手机号字段的索引名称
        message = '手机号已存在，请选择其他手机号。'; // 自定义错误消息
        errors = { phone: '手机号已存在' }; // 自定义错误字段
      } else {
        // 其他重复字段
        message = '数据库操作失败'; // 默认错误消息
      }
    }

    // 构建错误响应体
    const errorResponse = {
      status: HttpStatus.BAD_REQUEST, // 设置 HTTP 状态码为 400 Bad Request
      message,
      errors,
      timestamp: new Date().toISOString(), // 错误发生的时间
      path: request.url, // 错误发生的请求路径
    };

    // 返回错误响应
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
