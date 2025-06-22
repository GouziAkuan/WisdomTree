import { HttpException, HttpStatus } from '@nestjs/common';

class BadAdminException extends HttpException {
  constructor() {
    super('没有权限访问', HttpStatus.BAD_REQUEST);
  }
}

class NoAdminException extends HttpException {
  constructor() {
    super('管理员不存在', HttpStatus.BAD_REQUEST);
  }
}

export { BadAdminException, NoAdminException };
