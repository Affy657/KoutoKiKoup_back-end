import { Request, Response, RequestHandler } from 'express';
import Knife from '../models/knife';

type From = 'body' | 'params' | 'query';

const verifySelfknife = (from: From): RequestHandler => {
  return async (req: Request, res: Response, next) => {
    const data = req[from];

    try {
      const { id } = data;

      if (!id) {
        throw new Error('Missing ID');
      }

      const { _id } = res.locals.user;

      const knife = await Knife.findById(id);

      if (!knife) {
        throw new Error('Knife not found');
      }

      if (knife.userId.toString() !== _id.toString()) {
        throw new Error('Unauthorized');
      }

      res.locals.knife = knife;

      next();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}

export { verifySelfknife };