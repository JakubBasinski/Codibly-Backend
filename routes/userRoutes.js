import express from 'express';
import * as userController from '../controllers/userController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

//User
router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/pickup', isAuth, userController.pickupProduct);
router.post('/drop', isAuth, userController.dropProduct);


export default router;
