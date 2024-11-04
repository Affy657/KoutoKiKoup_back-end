import { Request, Response, RequestHandler } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

const auth: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
      throw new Error('Access denied');
    }

    const [type, token] = tokenHeader.split(' ');

    if (type !== 'Bearer') {
      throw new Error('Invalid token type');
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as { _id: string, role: string };

    const user = await User.findOne({ _id: decodedToken._id }, { password: 0 });

    res.locals.user = user;

    next();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export default auth;