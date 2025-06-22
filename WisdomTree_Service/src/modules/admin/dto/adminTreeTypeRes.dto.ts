// 管理员获取树种类列表
interface AdminTreeTypeListResDto {
  status: number;
  code: number;
  message: string;
  data: {
    page: number;
    pagesize: number;
    total: number;
    treeTypeList: Array<AdminTreeTypeListResDataDto>;
  };
}

interface AdminTreeTypeListResDataDto {
  id: number;
  avatar: string;
  scientific_name: string;
  common_name: string;
  description: string;
  total: number;
  remaining: number;
  energy: number;
}

// 管理员修改树种类信息
interface AdminUpadtTreeTypeReqDto {
  status: number;
  code: number;
  message: string;
}

// 管理员增加树种类
interface AdminAddTreeTypeReqDto extends AdminUpadtTreeTypeReqDto {}

// 管理员删除树种类
interface AdminDeleteTreeTypeReqDto extends AdminUpadtTreeTypeReqDto {}

// 管理员获取树种类信息
interface AdminTreeTypeInfoReqDto extends AdminUpadtTreeTypeReqDto {
  data: {
    id: number;
    avatar: string;
    scientific_name: string;
    common_name: string;
    description: string;
    total: number;
    remaining: number;
    energy: number;
  };
}

export {
  AdminTreeTypeListResDto,
  AdminUpadtTreeTypeReqDto,
  AdminAddTreeTypeReqDto,
  AdminDeleteTreeTypeReqDto,
  AdminTreeTypeInfoReqDto,
};
