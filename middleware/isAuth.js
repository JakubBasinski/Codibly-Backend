//@ts-nocheck

import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const decodedToken = jwt.verify(token, `${SECRET}`);
      decodedToken
        ? (req.Userdata = {
            email: decodedToken.email,
            userId: decodedToken.userId,
          })
        : res.staus(498).redirect('/auth');
      next();
    } else {
      res.status(400).redirect('/auth');
    }
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
};

export default isAuth;
