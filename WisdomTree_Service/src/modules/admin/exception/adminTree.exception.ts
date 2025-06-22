import { HttpException, HttpStatus } from '@nestjs/common';

class BadAdminGetTreeException extends HttpException {
  constructor() {
    super('管理员获取树木失败', HttpStatus.BAD_REQUEST);
  }
}

class BadAdminPutTreeImageException extends HttpException {
  constructor() {
    super('管理员修改某树详情图片失败', HttpStatus.BAD_REQUEST);
  }
}

class NoTreeTypeException extends HttpException {
  constructor() {
    super('不存在树类', HttpStatus.BAD_REQUEST);
  }
}

// 总数剩余新旧差值不一致
class BadDifference extends HttpException {
  constructor() {
    super('总数剩余新旧差值不一致', HttpStatus.CONFLICT);
  }
}

// 树木已被领养不能删除
class BadTreeDeleteException extends HttpException {
  constructor() {
    super('树木已被领养不能删除', HttpStatus.BAD_REQUEST);
  }
}

export {
  BadAdminGetTreeException,
  BadAdminPutTreeImageException,
  NoTreeTypeException,
  BadDifference,
  BadTreeDeleteException,
};
