// 创建token
interface PayloadDto {
  id: number;
  role: string;
}

// token解析后
interface ParseTokenDto {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

// 守卫返回的的req值
interface ReqDto {
  user: ParseTokenDto;
}

export { PayloadDto, ParseTokenDto, ReqDto };
