import { HttpException, HttpStatus } from '@nestjs/common';

class NoUserException extends HttpException {
  constructor() {
    super('用户不存在', HttpStatus.BAD_REQUEST);
  }
}

class NoUsernameException extends HttpException {
  constructor() {
    super('用户不存在', HttpStatus.BAD_REQUEST);
  }
}

class BadPasswordException extends HttpException {
  constructor() {
    super('密码错误', HttpStatus.BAD_REQUEST);
  }
}

class UserUpdateException extends HttpException {
  constructor() {
    super('用户更新失败', HttpStatus.BAD_REQUEST);
  }
}

export {
  NoUserException,
  NoUsernameException,
  BadPasswordException,
  UserUpdateException,
};
