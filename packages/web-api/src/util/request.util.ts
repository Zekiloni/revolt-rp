import { Request} from 'express';

export const getIpFromRequest = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for'];

  const ip =
    (typeof xForwardedFor === 'string'
      ? xForwardedFor.split(',').shift()
      : Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : undefined) ||
    req.socket?.remoteAddress ||
    req.ip;

  return ip || '';
}
