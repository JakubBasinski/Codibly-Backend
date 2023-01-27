import User from '../models/user.js';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export class UserConfig {
  static findUser(userData) {
    return User.findOne(userData);
  }
  static createUser(data, password) {
    const user = new User({
      name: data.name,
      email: data.email,
      password,
    });
    return user.save();
  }
  static findUserByid(id) {
    return User.findById(id);
  }
}

export const hashPassword = async (password, number) => {
  return bcrypt.hash(password, number);
};

// res.send(data);
export const comparePassowrd = async (sentPassword, userPassword) => {
  return bcrypt.compare(sentPassword, userPassword);
};
