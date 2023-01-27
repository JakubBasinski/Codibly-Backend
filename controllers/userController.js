import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import {
  UserConfig,
  hashPassword,
  comparePassowrd,
} from '../services/userService.js';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const createUser = async (req, res, ) => {
  const user = await UserConfig.findUser({ email: req.body.email });
  if (user) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  } else {
    const password = await hashPassword(req.body.password, 10);
    UserConfig.createUser(
      { name: req.body.name, email: req.body.email },
      password
    )
      .then(() => {
        res.status(200).json({ message: 'Success! Please login to continue' });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await UserConfig.findUser({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: 'Provided data is incorrect' });
      return;
    }
    const password = await comparePassowrd(req.body.password, user.password);
    if (password) {
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        `${SECRET}`,
        {
          expiresIn: '1h',
        }
      );
      res.status(200).json({
        token: token,
        userId: user._id,
        name: user.name,
        products: user.products,
      });
    } else {
      res.status(404).json({ message: 'Provided data is incorrect' });
    }
  } catch (err) {
    throw new Error(err);
  }
};
