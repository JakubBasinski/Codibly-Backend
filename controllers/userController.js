import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const createUser = async (req, res, next) => {
  console.log(req.body);
  const isUser = await User.findOne({ email: req.body.email });
  console.log(isUser);
  if (isUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  } else {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res
            .status(200)
            .json({ message: 'Success! Please login to continue' });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(500).json({ message: 'User not found !' });
      return;
    }
    const password = await bcrypt.compare(req.body.password, user.password);
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
      res.status(500).json({ message: 'Password incorrect' });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const pickupProduct = async (req, res, next) => {
  const { name, id, color } = req.body;
  const { email, userId } = req.Userdata;

  try {
    const user = await User.findById(userId);
    let doesExist = user?.products.some((product) => product.id === id);
    if (doesExist) {
      const products = user?.products;
      res.status(200).json({ message: 'Item already Picked Up!', products });
    } else {
      User.findOneAndUpdate(
        { _id: userId },
        { $push: { products: { name, id, color } } },
        { new: true },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.send(data);
          }
        }
      );
    }
  } catch (err) {
    res.json({ message: 'Something went wrong !' });
    throw new Error(err);
  }
};

export const dropProduct = async (req, res, next) => {
  const { name, id, color } = req.body;
  const { email, userId } = req.Userdata;
  console.log({ name, id, color, userId });
  try {
    const user = await User.findById(userId);

    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { products: { id: id } } },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send(data);
        }
      }
    );
  } catch (err) {
    res.json({ message: 'Something went wrong !' });
    throw new Error(err);
  }
};
