import express from 'express';
import * as catalogCtrl from'../controllers/catalogCtrl';
import * as productCtrl from '../controllers/productCtrl'
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const Router = express.Router();


	// Router.use(function(req, res, next) {

	// 		var token = req.body.token || req.query.token || req.headers['token'];
	
	//   	if (token && req.headers.cookie.id ) {
	//   		  var bytes  = CryptoJS.AES.decrypt(req.headers.cookie.id, KEY_HASH);
  //             var deid = bytes.toString(CryptoJS.enc.Utf8);
	// 	    jwt.verify(token, deid , function(err, decoded) {      
	// 	      if (err) {
	// 	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	// 	      } else {
	// 	        req.authenticate = decoded;    
	// 	        next();
	// 	      }
	// 	    });
	//   	} else {
	// 	    return res.status(403).send({ 
	// 	      	success: false, 
	// 	      	message: 'No token provided.' 
	// 	    });
	//     }
	// });

//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);
Router.get('/getAllCatalog', catalogCtrl.getAllCatalogCtrl);

//Product
Router.post('/createProduct', productCtrl.createProductCtrl);


export default Router;