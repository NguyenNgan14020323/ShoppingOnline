import express from 'express';
import * as userCtrl from '../app/controllers/userCtrl';

const Router = express.Router();
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);

export default Router;