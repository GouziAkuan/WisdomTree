import { HttpException, HttpStatus } from '@nestjs/common';

class NoTreeException extends HttpException {
  constructor() {
    super('未找到树', HttpStatus.BAD_REQUEST);
  }
}

class NoTreeNumException extends HttpException {
  constructor() {
    super('树木已领养完', HttpStatus.BAD_REQUEST);
  }
}

class BadGetUserAdoptTreeDetail extends HttpException {
  constructor() {
    super('获取用户树木详情失败', HttpStatus.BAD_REQUEST);
  }
}

class BadAdoptException extends HttpException {
  constructor() {
    super('领养树木失败', HttpStatus.BAD_REQUEST);
  }
}

export {
  NoTreeException,
  NoTreeNumException,
  BadGetUserAdoptTreeDetail,
  BadAdoptException,
};
