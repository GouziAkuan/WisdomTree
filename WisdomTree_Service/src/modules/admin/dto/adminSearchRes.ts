// 搜索树种
interface AdminSearchTreeTypeRes {
  status: number;
  code: number;
  message: string;
  data: Array<string>;
}

interface AdminSearchUserRes extends AdminSearchTreeTypeRes {}

export { AdminSearchTreeTypeRes, AdminSearchUserRes };
