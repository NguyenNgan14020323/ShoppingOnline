import express from 'express';
import * as catalogCtrl from'../controllers/catalogCtrl';
import * as productCtrl from '../controllers/productCtrl';
import constants from '../../config/constants';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const Router = express.Router();
const PRIVATE_KEY_TOKEN = constants.key_decode_token
const MYHOST = constants.host

Router.use(function(req, res, next) {

	var token = req.body.token || req.query.token || req.headers['token'];//req.headers['token'] = req.headers.token
//	console.log(req.headers)
//	if(req.headers.origin == MYHOST || req.headers.referer == MYHOST){//request from my host
		if (token) {
			jwt.verify(token, PRIVATE_KEY_TOKEN, function(err, decoded) {      
			    if (err) {
			       // return res.json({ error: true, message: 'Failed to authenticate user.' }); 
			        next()   
			    } else {
			        req.authenticate = decoded;  //da xac thuc thanh cong cho phep su dung
			        							 // o tat ca request den api/.... 
			        next();
			    }
			});
		} else {
			next();
			// return res.send({ //res.status(403).send
			//     success: false, 
			//     message: 'No token provided.' 
			// });
		}

//	}else{
	// 	 return res.status(403).send({
	// 		    success: false, 
	// 		    message: 'Not allow access host.' 
	// 	});
	// }
});

//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);
Router.get('/getAllCatalog', catalogCtrl.getAllCatalogCtrl);

//Product
Router.post('/createProduct', productCtrl.createProductCtrl);
Router.get('/getAllProduct', productCtrl.getAllProductCtrl);
Router.get('/productCatalog/:catalog_id', productCtrl.getProductCatalogCtrl);//get by parameters
Router.get('/productCatalog', productCtrl.getProductCatalogCtrl1);//get by query string
Router.get('/getproductDetail/:product_id', productCtrl.getProductDetailCtrl);

export default Router;