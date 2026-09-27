import { NextFunction, Request, Response } from 'express';
import { AdminType } from '@revolt-rp/common';
import { apiError } from '@revolt-rp/api-contract';
import { verifyJwtToken } from '../modules/authorization/auth.service';

export type ActorKind = 'user' | 'admin' | 'service';

export interface Actor {
  kind: ActorKind;
  id: string;
  accountId?: string;
  administrator: AdminType;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      actor?: Actor;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(apiError('UNAUTHORIZED', 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];
  const serviceToken = process.env.SERVICE_TOKEN;

  if (serviceToken && token === serviceToken) {
    req.actor = { kind: 'service', id: 'game', administrator: AdminType.NONE };
    return next();
  }

  const payload = verifyJwtToken(token);

  if (!payload) {
    return res.status(401).json(apiError('UNAUTHORIZED', 'Invalid or expired token'));
  }

  req.actor = {
    kind: payload.administrator > AdminType.NONE ? 'admin' : 'user',
    id: payload.accountId,
    accountId: payload.accountId,
    administrator: payload.administrator
  };
  req['user'] = payload;

  next();
};

export const allowActor = (...kinds: ActorKind[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.actor || !kinds.includes(req.actor.kind)) {
      return res.status(403).json(apiError('FORBIDDEN', 'Forbidden'));
    }

    next();
  };
};
