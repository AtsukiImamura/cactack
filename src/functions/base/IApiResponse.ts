export default interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
