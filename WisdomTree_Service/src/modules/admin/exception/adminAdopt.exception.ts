import { HttpException, HttpStatus } from '@nestjs/common';

class BadAdminGetAdoptException extends HttpException {
  constructor() {
    super('管理员获取领养表失败', HttpStatus.BAD_REQUEST);
  }
}

class BadAdminPutAdoptException extends HttpException {
  constructor() {
    super('管理员更新某领养失败', HttpStatus.BAD_REQUEST);
  }
}

class NoUserTreeException extends HttpException {
  constructor() {
    super('不存在用户/树木', HttpStatus.BAD_REQUEST);
  }
}

// 没有领养记录
class NoAdoptException extends HttpException {
  constructor() {
    super('没有领养记录', HttpStatus.BAD_REQUEST);
  }
}

export {
  BadAdminGetAdoptException,
  BadAdminPutAdoptException,
  NoUserTreeException,
  NoAdoptException,
};
