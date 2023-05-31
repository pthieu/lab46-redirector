import { Request, Response } from 'express';

import packageJson from '../../../package.json';

export const getServerInfo = async (_req: Request, res: Response) => {
  const data = {
    version: packageJson.version,
  };
  res.status(200).json(data);
};

export const ping = (_req: Request, res: Response) => {
  return res.status(200).json('pong');
};

export default {
  getServerInfo,
  ping,
};
