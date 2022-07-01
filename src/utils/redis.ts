/**
 * @name 简单模拟redis
 * @class MockRedis
 */
class MockRedis {
  db: Record<string, any>;
  constructor() {
    this.db = {};
  }

  async set(key: string, value: any) {
    return Promise.resolve().then(() => {
      this.db[key] = value;
    });
  }

  async get(key: string) {
    return Promise.resolve().then(() => {
      return this.db[key];
    });
  }
}

const mockRedis = new MockRedis();

export default mockRedis;
