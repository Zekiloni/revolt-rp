import { NextFunction, Request, Response } from 'express';
import { AdminType } from '@revolt-rp/common';

export const isAdministrator = (req: Request, res: Response, next: NextFunction) => {
  const administrator = req.actor?.administrator ?? req['user']?.administrator ?? AdminType.NONE;

  if (administrator < AdminType.TESTER) {
    return res.status(403).json({ message: 'forbidden' });
  }

  next();
};
