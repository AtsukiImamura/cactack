export default abstract class CustomeErrorBase extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
  }
}
