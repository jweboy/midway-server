import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application, Framework } from '@midwayjs/koa';
import { HttpStatus } from '@midwayjs/core';
import { generateToken } from '../../src/utils/token';
import mockRedis from '../../src/utils/redis';
import { encryptCipher } from '../../src/utils/crypto';

const REQUEST_URL = '/api/user/login';

describe(`POST ${REQUEST_URL}`, () => {
  let app: Application;
  // 标准用户
  const mockUser = { username: 'jack', password: 'redballoon' };
  // 无效用户名
  const mockUser1 = { username: 'jack chen', password: 'redballoon' };
  // 无效密码
  const mockUser2 = { username: 'jack', password: 'isscrect' };
  // 缺少用户名
  const mockUser3 = { password: 'redballoon' };
  // 缺少密码
  const mockUser4 = { username: 'jack' };
  // 包装基本请求
  const request = async user => {
    const { password, ...restData } = user;

    return await createHttpRequest(app)
      .post(REQUEST_URL)
      .type('form')
      .send({
        ...restData,
        ...(password && {
          // 这里就简单模拟密码加密解密的过程，正常前后端交互时采用非对称加密的方式
          password: encryptCipher(password),
        }),
      });
  };

  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
    } catch (err) {
      console.error('test beforeAll error', err);
      throw err;
    }
  });

  afterAll(async () => {
    await close(app);
  });

  it('should login successful', async () => {
    const payload = { username: mockUser.username };
    const signOptions = { persistKey: mockUser.username };
    const existUser = await mockRedis.get(mockUser.username);
    // 由于 redis 只是代码层面模拟的，所以每次都会创建最新的，这里就不模拟 redis 的情况了
    const mockToken = existUser
      ? existUser.token
      : await generateToken(payload, signOptions);

    const result = await request(mockUser);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body.code).toBe(HttpStatus.OK);
    expect(result.body.result).toBe('success');
    expect(result.body.message).toBe('登录成功');
    expect(result.body.data.token).toEqual(mockToken);
  });

  it('should login failed', async () => {
    const result1 = await request(mockUser1);
    expect(result1.status).toBe(HttpStatus.OK);
    expect(result1.body.data).toBe(null);
    expect(result1.body.result).toEqual('error');
    expect(result1.body.message).toEqual('账号或密码不正确');
    expect(+result1.body.code).toBe(HttpStatus.BAD_REQUEST);

    const result2 = await request(mockUser2);
    expect(result2.status).toBe(HttpStatus.OK);
    expect(result2.body.data).toBe(null);
    expect(result2.body.result).toEqual('error');
    expect(result2.body.message).toEqual('账号或密码不正确');
    expect(+result2.body.code).toBe(HttpStatus.BAD_REQUEST);

    const result3 = await request(mockUser3);
    expect(result3.status).toBe(HttpStatus.OK);
    expect(result3.body.data).toBe(null);
    expect(result3.body.result).toEqual('error');
    expect(+result3.body.code).toBe(HttpStatus.BAD_REQUEST);

    const result4 = await request(mockUser4);
    expect(result4.status).toBe(HttpStatus.OK);
    expect(result4.body.data).toBe(null);
    expect(result4.body.result).toEqual('error');
    expect(+result4.body.code).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should timeout is less than 1000', async () => {
    const startTime = Date.now();
    await request(mockUser);
    const costTime = Date.now() - startTime;
    expect(costTime).toBeLessThanOrEqual(1000);
  });
});
