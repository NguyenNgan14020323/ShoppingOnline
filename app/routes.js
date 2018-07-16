import express from 'express';
import * as userCtrl from '../app/controllers/userCtrl';
import * as catalogCtrl from'../app/controllers/catalogCtrl';

const Router = express.Router();
//User
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
Router.post('/logout', userCtrl.checkUserLogoutCtrl);
//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);

export default Router;