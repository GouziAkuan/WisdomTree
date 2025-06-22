import { HttpException, HttpStatus } from '@nestjs/common';

class UploadSizeException extends HttpException {
  constructor() {
    super('文件大于5mb', HttpStatus.BAD_REQUEST);
  }
}

// 文件不存在
class InvalidFileException extends HttpException {
  constructor() {
    super('文件不存在', HttpStatus.BAD_REQUEST);
  }
}

// 删除文件失败
class DeleteFileException extends HttpException {
  constructor() {
    super('删除文件失败', HttpStatus.BAD_REQUEST);
  }
}

export { UploadSizeException, InvalidFileException, DeleteFileException };
