import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * 验证异常过滤器，用于处理管道验证失败 BadRequestException。
 * 该过滤器捕获所有由 BadRequestException 引发的异常，并返回标准化的错误响应。
 */
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  /**
   * 处理捕获到的 BadRequestException 异常。
   * @param exception 捕获到的 BadRequestException 异常对象。
   * @param host ArgumentsHost 对象，提供访问请求和响应对象的能力。
   */
  catch(exception: BadRequestException, host: ArgumentsHost) {
    // 获取 HTTP 上下文对象
    const ctx = host.switchToHttp();
    // 获取响应对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<Request>();

    // 获取异常响应体（如果存在）
    const responseBody = exception.getResponse() as any;

    // 构建错误响应体
    const errorResponse = {
      status: HttpStatus.BAD_REQUEST, // HTTP 状态码 400 表示错误请求
      message: '验证失败', // 错误消息，表示验证失败
      errors: responseBody.message || '错误请求异常', // 详细的错误信息，默认为 '错误请求异常'
      timestamp: new Date().toISOString(), // 错误发生的时间
      path: request.url, // 错误发生的请求路径
    };

    // 返回错误响应
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
