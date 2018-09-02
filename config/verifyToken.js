
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import con from './constants.js';

const PRIVATE_KEY_TOKEN = con.key_decode_token;
const MYHOST = con.host;

const verifyToken = function(req, res, next){
	
	var token = req.body.token || req.query.token || req.headers['token'];//req.headers['token'] = req.headers.token
	if(req.headers.origin == MYHOST || req.headers.referer == MYHOST)//request from my host
	{
		if (token != undefined && token != null) {
			jwt.verify(token, PRIVATE_KEY_TOKEN, function(err, decoded) {      
			    if (err) {
			        return res.status(201).json(
			        	                         { error: true, 
			        		                        message: con.err_status.N1001 });  
			    } else {
			        req.authenticate = decoded;  //da xac thuc thanh cong cho phep su dung
			        next();
			    }
			});
		} else {
			return res.status(403).send({ //res.status(403).send
			     success: false, 
			     message: con.err_status.N1002
			});
		}

	}else{
	 	return res.status(503).send({
	 		    success: false, 
	 		    message: con.err_status.N1003 
	 	});
	}

}

module.exports = verifyToken;