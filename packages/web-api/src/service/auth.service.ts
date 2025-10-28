import jwt from 'jsonwebtoken';
import { AdminType } from '@revolt-rp/common';
import { authConfig } from '@revolt-rp/core';


export interface IJwtPayload {
  accountId: string;
  username: string;
  administrator: AdminType
}

export const generateJwtToken = (payload: IJwtPayload) => {
  return jwt.sign(payload, authConfig.JWT_SECRET, { expiresIn: 60 * 60 });
};

export const verifyJwtToken = (token: string): IJwtPayload | null => {
  try {
    return jwt.verify(token, authConfig.JWT_SECRET) as IJwtPayload;
  } catch (e) {
    return null;
  }
}
