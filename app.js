import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import * as dotenv from 'dotenv';

dotenv.config();

const USER = process.env.MONGO_USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(userRoutes);

mongoose
  .connect(
    `mongodb+srv://${USER}:${PASSWORD}@pierwszycluster.ram8q.mongodb.net/Products?authSource=admin&replicaSet=atlas-cx3nkc-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`
  )
  .then((result) => {
    console.log('CONNECTED TO MONGODB -  PRODUCTS');
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
