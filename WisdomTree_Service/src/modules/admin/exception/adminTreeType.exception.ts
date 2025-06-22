import { HttpException, HttpStatus } from '@nestjs/common';

class BadAdminPutTreeTypeException extends HttpException {
  constructor() {
    super('管理员修改某树种类信息失败', HttpStatus.BAD_REQUEST);
  }
}

// 树类重复
class TreeTypeDuplicateException extends HttpException {
  constructor() {
    super('树类重复，操作失败', HttpStatus.CONFLICT);
  }
}

class TreeTypeUpdateHaveAdoptException extends HttpException {
  constructor() {
    super('该树种下有树已经被领养，不允许修改树种', HttpStatus.CONFLICT);
  }
}

// 不允许删除
class TreeTypeDeleteException extends HttpException {
  constructor() {
    super('该树种下有树已经被领养，不允许删除树种', HttpStatus.CONFLICT);
  }
}

export {
  BadAdminPutTreeTypeException,
  TreeTypeDuplicateException,
  TreeTypeUpdateHaveAdoptException,
  TreeTypeDeleteException,
};
