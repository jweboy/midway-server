import { Catch } from '@midwayjs/decorator';
import { MidwayHttpError } from '@midwayjs/core';
import { getErrorReponse } from '../utils/response';

@Catch()
export class InternalServerErrorFilter {
  async catch(err: MidwayHttpError) {
    return getErrorReponse(err);
  }
}
