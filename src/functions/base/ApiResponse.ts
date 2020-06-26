import IApiResponse from "./IApiResponse";

export default class ApiResponse<T> {
  private _code: number;

  private _message: string;

  private _data: any;

  constructor(code: number = 200, message: string = "", data: any = {}) {
    this._code = code;
    this._message = message;
    this._data = data;
  }

  public json(): IApiResponse<T> {
    return {
      code: this._code,
      message: this._message,
      data: this._data,
    };
  }
}
