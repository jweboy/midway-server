import { Inject, Controller, Body, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { HttpStatus, MidwayHttpError } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import * as dayjs from 'dayjs';
import UserLoginDTO from '../dto/user.dto';
import { UserModel } from '../model/user.model';
import mockRedis from '../utils/redis';
import { generateToken } from '../utils/token';
import { decryptCipher } from '../utils/crypto';

@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserModel;

  @Post('/user/login')
  @Validate()
  async getUser(@Body() body: UserLoginDTO) {
    // 解密用户密码
    const password = decryptCipher(body.password);
    // 入库查找当前请求的用户
    const user = await this.userService.getUserByUsernameAndPassword(
      body.username,
      password
    );

    // 数据库中找到了此用户
    if (user != null) {
      const { username } = user;
      // 查找当前用户信息是否已保存至 redis
      const existUser = await mockRedis.get(username);
      const payload = { username };
      const signOptions = { persistKey: username };
      let token;
      // 用户首次登录时redis中不存在token等信息，需要生成一个可用的token信息存入redis中
      if (!existUser) {
        token = await generateToken(payload, signOptions);
      } else {
        // 用户再次登录时已有保存过的token信息，那么就从redis中直接获取，同时校验token的时效性
        const currTime = dayjs();
        const diffHours = currTime.diff(existUser.expiresIn, 'hours');
        // 假设token有效期为10个小时，超过时间就表明token失效需要重新生成
        if (diffHours > 10) {
          token = await generateToken(payload, signOptions);
        } else {
          token = existUser.token;
        }
      }
      // 返回token给当前请求的用户
      return { data: { token }, msg: '登录成功' };
    }

    // 数据库中没找到此用户，可能是用户名/密码输入错误、用户未注册等原因。
    throw new MidwayHttpError('账号或密码不正确', HttpStatus.BAD_REQUEST);
  }
}
