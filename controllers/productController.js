import User from '../models/user.js';

import * as dotenv from 'dotenv';

dotenv.config();

export const pickupProduct = async (req, res, next) => {
    const { name, id, color } = req.body;
    const {  userId } = req.Userdata;
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
    const { userId } = req.Userdata;
    console.log({ name, id, color, userId });
    try {
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
  