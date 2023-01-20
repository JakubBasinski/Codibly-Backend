import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const decodedToken = jwt.verify(token, `${SECRET}`);
      // @ts-ignore
      req.Userdata = { email: decodedToken.email, userId: decodedToken.userId };
      next();
    } else {
      res.status(409).redirect('/auth');
    }
  } catch (err) {
    console.log(err);
  }
};

export default isAuth;
