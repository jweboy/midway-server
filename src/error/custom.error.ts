// src/error/custom.error.ts
import { MidwayError } from '@midwayjs/core';

export class CustomError extends MidwayError {
  constructor(msg, code) {
    super(msg, code);
  }
}
