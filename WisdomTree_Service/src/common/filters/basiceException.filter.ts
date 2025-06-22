import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * 基本异常过滤器，用于捕获所有未处理的异常。
 * 捕获所有类型的异常，并返回标准化的错误响应。
 */
@Catch()
export class BasicExceptionsFilter implements ExceptionFilter {
  /**
   * 处理捕获到的异常。
   * @param exception 捕获到的异常对象。
   * @param host ArgumentsHost 对象，提供访问请求和响应对象的能力。
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定异常的 HTTP 状态码。如果异常是 HttpException 类型，则获取其状态码，否则默认为 500 (INTERNAL_SERVER_ERROR)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 确定异常的消息。如果异常是 HttpException 类型，则获取其消息，否则使用默认消息 '服务器内部错误'
    const message =
      exception instanceof HttpException ? exception.message : '服务器内部错误';

    // 构建错误响应体
    const errorResponse = {
      status: status, // HTTP 状态码
      code: 1, // 错误码
      message, // 错误消息
      timestamp: new Date().toISOString(), // 错误发生的时间
      path: request.url, // 错误发生的请求路径
    };

    // 返回错误响应
    response.status(status).json(errorResponse);
  }
}
