import express from 'express';
import * as userCtrl from '../app/controllers/userCtrl';
import * as catalogCtrl from '../app/controllers/catalogCtrl';
import * as productCtrl from '../app/controllers/productCtrl';

const Router = express.Router();
//User
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
Router.post('/logout', userCtrl.checkUserLogoutCtrl);
//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);
Router.get('/getAllCatalog', catalogCtrl.getAllCatalogCtrl);

//Product
Router.post('/createProduct', productCtrl.createProductCtrl);

export default Router;