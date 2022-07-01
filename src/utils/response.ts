import { HttpStatus } from '@midwayjs/core';

export const getErrorReponse = (err: ICustomError) => {
  const { code, message } = err;
  return {
    result: 'error',
    data: null,
    message,
    code,
  } as IResponse<null>;
};

export const getSuccessReponse = <T>(data, msg) => {
  return {
    result: 'success',
    message: msg || '请求成功',
    code: HttpStatus.OK,
    data,
  } as IResponse<T>;
};
