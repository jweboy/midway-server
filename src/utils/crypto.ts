import {
  createCipheriv,
  createDecipheriv,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
} from 'crypto';

const key = randomBytes(32);
const iv = randomBytes(16);
const algorithm = 'aes-256-cbc';
const encoding = 'hex';

export const encryptCipher = text => {
  const cipher = createCipheriv(algorithm, key, iv);
  cipher.update(text);
  return cipher.final(encoding);
};

export const decryptCipher = encrypted => {
  const cipher = createDecipheriv(algorithm, key, iv);
  cipher.update(encrypted, encoding);
  return cipher.final('utf8');
};

export const encryptPublicKey = (data, pubclicKey) => {
  return publicEncrypt(pubclicKey, Buffer.from(data));
};

export const decryptPrivateKey = (data, privateKey) => {
  return privateDecrypt(privateKey, data);
};
