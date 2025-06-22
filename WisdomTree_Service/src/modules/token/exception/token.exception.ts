import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 表示访问令牌（AccessToken）无效或已过期的异常类。
 * 当客户端提供的AccessToken不能被正确验证或已过期时，抛出此异常。
 */
class BadAccessTokenException extends HttpException {
  constructor() {
    super('AccessToken过期/错误', HttpStatus.BAD_REQUEST);
  }
}

/**
 * 表示访问令牌（AccessToken）不存在的异常类。
 * 当客户端未提供AccessToken或提供的AccessToken不存在于系统中时，抛出此异常。
 */
class NoAccessTokenException extends HttpException {
  constructor() {
    super('AccessToken不存在', HttpStatus.BAD_REQUEST);
  }
}

/**
 * 表示刷新令牌（RefreshToken）无效、过期或错误的异常类。
 * 当客户端提供的RefreshToken不能被正确验证、已过期或格式错误时，抛出此异常。
 */
class BadRefreshTokenException extends HttpException {
  constructor() {
    super('RefreshToken过期/错误', HttpStatus.BAD_REQUEST);
  }
}

export {
  BadAccessTokenException,
  BadRefreshTokenException,
  NoAccessTokenException,
};
