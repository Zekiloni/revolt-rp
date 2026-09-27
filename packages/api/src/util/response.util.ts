import { Request } from 'express';

export const buildHref = (request: Request, path: string) => {
  return `${request.protocol}://${request.get('host')}${path}`;
};
