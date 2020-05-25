export default class ErrorMessage {
  /** firebase: ネットワーク系 */
  public static readonly FB_NETWORK_ERROR = "auth/network-request-failed";

  public static readonly FB_WRONG_PASSWORD = "auth/wrong-password";

  public static readonly FB_RESOURCE_EXHAUSTED = "resource-exhausted";

  public static readonly EMAIL_NOT_VERIFIED = "email-not-verified";

  private _errorCode: string;

  /**
   * Getter message
   * @return {string }
   */
  public get value(): string {
    switch (this._errorCode) {
      case ErrorMessage.FB_NETWORK_ERROR:
        return "ネットワークエラーが発生しました";
      case ErrorMessage.FB_WRONG_PASSWORD:
        return "メールアドレスまたはパスワードが間違っています";
      case ErrorMessage.FB_RESOURCE_EXHAUSTED:
        return "アプリが一時停止しています。しばらくお待ちください。";
      case ErrorMessage.EMAIL_NOT_VERIFIED:
        return "メールアドレスが認証されていません。";
      default:
        return "エラーが発生しました";
    }
  }

  constructor(errorCode: string) {
    this._errorCode = errorCode;
  }
}
