import express from 'express';
import * as userController from '../controllers/userController.js';
import * as productController from '../controllers/productController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

//User
router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/pickup', isAuth, productController.pickupProduct);
router.post('/drop', isAuth, productController.dropProduct);

export default router;
