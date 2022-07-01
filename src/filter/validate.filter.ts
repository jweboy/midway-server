import { HttpStatus } from '@midwayjs/core';
import { Catch } from '@midwayjs/decorator';
import { MidwayValidationError } from '@midwayjs/validate';
import { getErrorReponse } from '../utils/response';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError) {
    const error: ICustomError = new Error(err.message);
    error.code = HttpStatus.BAD_REQUEST;
    return getErrorReponse(error);
  }
}
