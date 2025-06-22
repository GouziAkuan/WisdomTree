// 获取树木列表
interface GetTreeRequestDto {
  status: number;
  code: number;
  message: string;
  data: GetTreeRequestDataDto;
}

interface GetTreeRequestDataDto {
  userEnergy: number;
  treeType: Array<GetTreeDataRequestDto>;
}

interface GetTreeDataRequestDto {
  id: number; //树ID
  avatar: string;
  scientific_name: string;
  total: number;
  remaining: number;
  energy: number;
}

// 获取某树木详情信息
interface GetTreeDetailRequestDto {
  status: number;
  code: number;
  message: string;
  data: GetTreeDetailDataRequestDto;
}

interface GetTreeDetailDataRequestDto {
  id: number; //树ID
  avatar: string;
  scientific_name: string;
  common_name: string;
  description: string;
  total: number;
  remaining: number;
  energy: number;
  userEnergy: number;
}

// 领养树木
interface AdoptTreeRequestDto {
  status: number;
  code: number;
  message: string;
  data: AdoptTreeDataRequestDto;
}

interface AdoptTreeDataRequestDto {
  adoptionID: string;
  nickName: string;
  treeType: string;
}

// 领养树木数量处理
interface AdoptTreeNumberRequestDto {
  treeId: number;
  total: number;
  remaining: number;
}

// 获取用户领养树木信息
interface GetUserAdoptTreeRequestDto {
  status: number;
  code: number;
  message: string;
  data: Array<GetUserAdoptTreeDataRequestDto>;
}

interface GetUserAdoptTreeDataRequestDto {
  id: number; //领养记录ID
  tree_type: string;
  scientific_name: string;
  avatar: string;
}

// 获取用户领养树木详情
interface GetUserAdoptTreeDetailRequestDto {
  status: number;
  code: number;
  message: string;
  data: GetUserAdoptTreeDetailDataRequestDto;
}

interface GetUserAdoptTreeDetailDataRequestDto {
  id: number; //领养记录ID
  adoption_id: string;
  nickname: string;
  tree_type: string;
  adopted_at: string;
  avatar: string;
  scientific_name: string;
  common_name: string;
  description: string;
  total: number;
  wish: string;
  remaining: number;
  area: string;
  detailImage: Array<string>;
}

export {
  GetTreeRequestDto,
  GetTreeDetailRequestDto,
  AdoptTreeRequestDto,
  AdoptTreeNumberRequestDto,
  GetUserAdoptTreeRequestDto,
  GetUserAdoptTreeDetailRequestDto,
};
