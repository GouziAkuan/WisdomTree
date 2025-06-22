import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * 所有异常的过滤器类，用于捕获 NestJS 应用中的异常并统一处理。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * 捕获异常并处理。
   * @param exception 异常对象，可以是任何类型的错误。
   * @param host 用于获取请求和响应对象的 ArgumentsHost 对象。
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 切换到 HTTP 上下文
    const ctx = host.switchToHttp();
    // 获取响应对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<Request>();
    // 根据异常类型确定 HTTP 状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 初始化错误详情变量
    let message: string | object =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    let errors = null;

    // 如果是 BadRequestException，则格式化错误详情
    if (exception instanceof BadRequestException) {
      const responseBody = exception.getResponse() as any;
      message = 'Validation Failed';
      errors = responseBody.message || 'Bad Request Exception';
    }

    // 如果是 QueryFailedError（通常是数据库唯一性约束失败），处理重复用户的情况
    if (exception instanceof QueryFailedError) {
      const errorCode = exception.driverError.code; // 获取数据库错误代码

      if (errorCode === 'ER_DUP_ENTRY') {
        // MySQL 错误代码，可能会根据不同数据库而有所不同
        message = '用户名已存在，请选择其他用户名。';
        errors = { username: '用户名已存在' }; // 可以在这里设置更具体的错误信息
      } else {
        message = '数据库操作失败';
      }
    }

    // 构建统一的错误响应对象
    // 自定义错误格式
    const errorResponse = {
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 设置响应状态码和内容
    response.status(status).json(errorResponse);
  }
}
