import { IsString } from 'class-validator';

// 搜索树种
class searchTreeType {
  @IsString()
  treeTypeInput: string;
}

// 搜索用户
class AdminSearchUserDto {
  @IsString()
  userInput: string;
}

export { searchTreeType, AdminSearchUserDto };
