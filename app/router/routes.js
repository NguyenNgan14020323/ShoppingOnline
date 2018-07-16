import express from 'express';
import * as userCtrl from '../controllers/userCtrl';

const Router = express.Router();
//User
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
Router.post('/logout', userCtrl.checkUserLogoutCtrl);

export default Router;