import { NextFunction, Request, Response } from 'express';
import { AdminType, IAccount } from '@revolt-rp/common';


export const isAdministrator = (req: Request, res: Response, next: NextFunction) => {
  const user = req['user'] as IAccount;

  if (!user || !user.administrator < AdminType.TESTER) {
    return res.status(403).json({ message: 'forbidden' });
  }

  next();
};
