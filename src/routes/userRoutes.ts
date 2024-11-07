import { Router, Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Knife from '../models/knife';
import auth from '../middlewares/auth';

const router = Router();

const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!req.body.password) {
      throw new Error('Password is required');
    }

    const password = bcrypt.hashSync(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      password
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({
      _id: savedUser._id,
      role: savedUser.role
    }, process.env.TOKEN_SECRET as string);

    const user = {
      _id: savedUser._id,
      username: savedUser.username,
      token,
      role: savedUser.role
    };

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

const logIn: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      throw new Error('User not found');
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({
      _id: user._id,
      role: user.role
    }, process.env.TOKEN_SECRET as string);

    res.json({
      _id: user._id,
      username: user.username,
      token,
      role: user.role
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

const getMe: RequestHandler = async (req: Request, res: Response) => {
  res.json(res.locals.user);
}

const getUserById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });

    if (!user) {
      throw new Error('User not found');
    }

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

const getUserKnives: RequestHandler = async (req: Request, res: Response) => {
  try {
    console.log(res.locals.user._id);
    const knives = await Knife.find({ userId: res.locals.user._id });

    res.json(knives);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/', auth, getMe);
router.get('/knives', auth, getUserKnives);
router.get('/:id', getUserById);

export default router;