import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1656427860810_1823',
  koa: {
    port: 7001,
  },
  orm: {
    type: 'mysql',
    host: 'rm-bp18bi364r33z24d64o.mysql.rds.aliyuncs.com',
    port: 3306,
    username: 'jl',
    password: 'Jl940630',
    database: 'job',
    synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: false,
  },
} as MidwayConfig;
