import { BaseUrl } from '../BaseUrl'

// 删除文件
const deleteFileConfig = (fileUrl) => {
  return {
    method: 'delete',
    url: `${BaseUrl}/file/delete`,
    params: { fileUrl }
  }
}

export default deleteFileConfig
