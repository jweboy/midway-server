import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { getSuccessReponse } from '../utils/response';

@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { data, msg } = await next();
      return getSuccessReponse(data, msg);
    };
  }

  match(ctx) {
    return ctx.path.indexOf('/api') !== -1;
  }
}
