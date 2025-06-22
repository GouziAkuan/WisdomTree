/**
 * 上传文件的响应数据传输对象（DTO）。
 * 用于在文件上传成功后返回相关信息。
 */
interface UploadResDto {
  status: number;
  code: number;
  filename: string;
  path: string;
}

interface DeleteResFile {
  status: number;
  code: number;
  message: string;
}

// 转换为base64响应数据。
interface ConvertResDto {
  status: number;
  code: number;
  message: string;
  base64: string;
}

export { UploadResDto, DeleteResFile, ConvertResDto };
