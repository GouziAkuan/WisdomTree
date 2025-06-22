/**
 * 接口用于描述刷新访问令牌响应的数据结构。
 */
interface RefreshAccessResponseDto {
  /**
   * HTTP 状态码，表示请求的结果。
   * 例如：200 表示成功，401 表示未授权等。
   */
  status: number;

  /**
   * 自定义的状态码，用于表示具体的业务状态。
   * 例如：0 表示成功，1表示刷新令牌无效等。
   */
  code: number;

  /**
   * 描述请求处理结果的消息。
   * 例如：'Access token refreshed successfully' 或 'Invalid refresh token'.
   */
  message: string;

  /**
   * 返回的主要数据对象，包含新的访问令牌。
   */
  data: {
    /**
     * 刷新后的访问令牌，用于身份验证。
     */
    accessToken: string;
  };
}

/**
 * 接口用于描述刷新令牌响应的数据结构。
 */
interface RefreshTokenResponseDto {
  /**
   * 刷新令牌，用于获取新的访问令牌。
   */
  refreshToken: string;
}

export { RefreshAccessResponseDto, RefreshTokenResponseDto };
