import { Request } from 'express';

export type JWTUserInfo = {
  userId: string;
};

export type AuthRequest = Request & {
  user: JWTUserInfo;
};
