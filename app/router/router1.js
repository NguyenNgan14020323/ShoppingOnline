import express from 'express';
import * as catalogCtrl from'../../app/controllers/catalogCtrl';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const Router = express.Router();

//token 
	Router.use(function(req, res, next) {

	  	var token = req.body.token || req.query.token || req.headers['token'];
	  	if (token) {
	  		  var bytes  = CryptoJS.AES.decrypt(req.header.cookie.id, KEY_HASH);
              var deid = bytes.toString(CryptoJS.enc.Utf8);
		    jwt.verify(token, deid , function(err, decoded) {      
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		      } else {
		        req.authenticate = decoded;    
		        next();
		      }
		    });
	  	} else {
		    return res.status(403).send({ 
		      	success: false, 
		      	message: 'No token provided.' 
		    });
	    }
	});

//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);
Router.get('/getAllCatalog', catalogCtrl.getAllCatalogCtrl);

//Product
Router.post('/createProduct', productCtrl.createProductCtrl);


export default Router;