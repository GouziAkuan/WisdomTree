export interface TotalStatisticsDto {
  /** 树木总数 */
  totalTrees: number;
  /** 树种总数 */
  totalTreeTypes: number;
  /** 领养总数 */
  totalAdoptions: number;
  /** 用户总数 */
  totalUsers: number;
}

// 地区领养分布
export interface AreaDistributionDto {
  /** 区域名称 */
  area: string;
  /** 该区域的领养数量 */
  count: number;
}

// 树种领养排行
export interface TreeTypeDistributionDto {
  /** 树种名称 */
  treeType: string;
  /** 该树种的领养数量 */
  count: number;
}

//用户获取其领养树种分布数据
export interface TreeTypeUserDto extends TreeTypeDistributionDto {}

// 用户端：获取树木总量和种类总数
export interface UserStatisticsDto {
  /** 树木总数 */
  totalTrees: number;
  /** 树种总数 */
  totalTypes: number;
}

// 领养趋势
export interface AdoptionTrendDto {
  /** 日期（YYYY-MM-DD格式） */
  date: string;
  /** 当天的领养数量 */
  count: number;
}

//树种分布
export interface TreeTypeChartDto {
  /** 树种名称 */
  treeType: string;
  /** 该树种的数量 */
  count: number;
}

// 领养类型排行
export interface AdoptionTypeChartDto {
  /** 领养类型 */
  adoptionType: string;
  /** 该领养类型的数量 */
  count: number;
}

// 返回获取7日步数
export interface UserRunInfo {
  // 日期
  date: string;
  // 今日步数
  step: number;
}
