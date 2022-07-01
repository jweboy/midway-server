interface IResponse<T> {
  data: T;
  code: number | string;
  result: 'success' | 'error';
  message: string;
}
