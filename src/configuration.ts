import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as orm from '@midwayjs/orm';
import { ReportMiddleware } from './middleware/report.middleware';
import { ValidateErrorFilter } from './filter/validate.filter';
import { InternalServerErrorFilter } from './filter/internal.filter';
import { FormatMiddleware } from './middleware/format.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    orm,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, FormatMiddleware]);
    // add filter
    this.app.useFilter([ValidateErrorFilter, InternalServerErrorFilter]);
  }
}
