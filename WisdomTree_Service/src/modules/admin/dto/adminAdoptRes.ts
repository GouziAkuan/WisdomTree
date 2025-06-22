// 管理员获取领养表
interface AdminGetAdoptRes {
  status: number;
  code: number;
  message: string;
  data: {
    page: number;
    pagesize: number;
    total: number;
    adoptList: Array<AdminGetAdoptDataRes>;
  };
}

interface AdminGetAdoptDataRes {
  id: number;
  username: string;
  adoption_id: string;
  scientific_name: string;
  area: string;
  tree_type: string;
  wish: string;
  detailImage: Array<string>;
}

// 获取领养详情
interface AdminGetAdoptDetailRes {
  status: number;
  code: number;
  message: string;
  data: AdminGetAdoptDetailData;
}

interface AdminGetAdoptDetailData extends AdminGetAdoptDataRes {
  nickname: string;
}

interface AdminPutAdoptDetailRes {
  status: number;
  code: number;
  message: string;
}

// 删除领养
interface AdminDelAdoptRes extends AdminPutAdoptDetailRes {}

export {
  AdminGetAdoptRes,
  AdminGetAdoptDetailRes,
  AdminPutAdoptDetailRes,
  AdminGetAdoptDataRes,
  AdminDelAdoptRes,
};
