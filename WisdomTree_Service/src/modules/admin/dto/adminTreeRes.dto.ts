// 获取树木列表
interface AdminGetTreeReqDto {
  status: number;
  code: number;
  message: string;
  data: {
    page: number;
    pagesize: number;
    total: number;
    treeList: Array<GetTreeDataRequestDto>;
  };
}

interface GetTreeDataRequestDto {
  id: number; //树ID
  scientific_name: string;
  isAdopted: boolean;
  detailImage: Array<string>;
}

// 管理员创建树
interface AdminCreateTreeResDto {
  status: number;
  code: number;
  message: string;
}

// 管理员修改某树详情图片
interface AdminUpdateTreeImageResDto extends AdminCreateTreeResDto {}

// 管理员删除树
interface AdminDeleteTreeResDto extends AdminCreateTreeResDto {}

// 管理员获取树木详情图片
interface AdminTreeDeailReqDto extends AdminCreateTreeResDto {
  data: {
    treeType: string;
    detailImage: Array<string>;
  };
}

// 管理员获取树木筛选值
interface AdminGetTreeFilterResDto {
  status: number;
  code: number;
  message: string;
  data: Array<string>;
}

export {
  AdminCreateTreeResDto,
  AdminGetTreeReqDto,
  AdminUpdateTreeImageResDto,
  AdminTreeDeailReqDto,
  AdminDeleteTreeResDto,
  GetTreeDataRequestDto,
  AdminGetTreeFilterResDto,
};
