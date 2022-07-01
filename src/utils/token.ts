import dayjs = require('dayjs');
import { sign } from 'jsonwebtoken';
import mockRedis from './redis';

export const generateToken = async <T>(
  payload: T,
  options?: { expiresIn?: string; persist?: boolean; persistKey?: string }
) => {
  const { expiresIn, persist = true, persistKey = 'persistKey' } = options;
  const secret = 'secret';
  const token = sign(payload, secret, { expiresIn: expiresIn || '10h' });
  if (persist) {
    await mockRedis.set(persistKey, {
      expiresIn: dayjs().toDate(),
      token,
    });
  }
  return token;
};
