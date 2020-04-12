import ErrorCode from "@/model/error/ErrorCode";
export default class ErrorMessage {
  private _errorCode: ErrorCode;

  private _message: string = "";

  /**
   * Getter message
   * @return {string }
   */
  public get value(): string {
    return this._message;
  }

  constructor(errorCode: string) {
    this._errorCode = new ErrorCode(errorCode);
    console.log(errorCode);
    if (this._errorCode.isNetworkError) {
      this._message = "ネットワークエラーが発生しました";
      return;
    }
    if (this._errorCode.isWrongPassword) {
      this._message = "メールアドレスまたはパスワードが間違っています";
      return;
    }
    this._message = "エラーが発生しました";
  }
}
