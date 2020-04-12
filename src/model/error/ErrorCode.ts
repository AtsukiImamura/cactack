export default class ErrorCode {
  /** firebase: ネットワーク系 */
  public static readonly FB_NETWORK_ERROR = "auth/network-request-failed";

  public static readonly FB_WRONG_PASSWORD = "auth/wrong-password";

  private _code: string;

  /**
   * Getter code
   * @return {string}
   */
  public get code(): string {
    return this._code;
  }

  constructor(code: string) {
    this._code = code;
  }

  public get isNetworkError(): boolean {
    return this.code === ErrorCode.FB_NETWORK_ERROR;
  }

  public get isWrongPassword(): boolean {
    return this.code === ErrorCode.FB_WRONG_PASSWORD;
  }
}
