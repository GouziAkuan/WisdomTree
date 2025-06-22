import { IsNumber, IsString } from 'class-validator';

// 前端获取微信步数
class decryptDto {
  @IsString()
  code: string;
  @IsString()
  encryptedData: string;
  @IsString()
  iv: string;
}

// 微信运动数据
interface wxRunData {
  timestamp: number;
  step: number;
}

// 微信运动数据水印
interface watermark {
  timestamp: number;
  appid: string;
}

// 获取 session_key
interface sessionInfo {
  openid: string;
  session_key: string;
}

// 微信运动数据返回
interface wxRunRes {
  stepInfoList: wxRunData[];
  watermark: watermark;
}

// 今日可领取能量与步数相关数据
interface todayInfo {
  // 能量表ID
  id?: number;
  // 可领取能量
  energy?: number;
  // 今日步数
  step: number;
}

// 用户领取能量
class receiveEnergyDto {
  // 能量表ID
  @IsNumber()
  id: number;
  // 领取的能量值
  @IsNumber()
  energy: number;
}

export {
  decryptDto,
  wxRunRes,
  wxRunData,
  sessionInfo,
  todayInfo,
  receiveEnergyDto,
};
