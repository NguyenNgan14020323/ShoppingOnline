import express from 'express';
import * as userCtrl from '../controllers/userCtrl';
import verifyToken from '../../config/verifyToken';

const Router = express.Router();

//all 
Router.use(function (req, res, next) {
	//res.setHeader('Access-Control-Allow-Origin', '*');//allow all of client response when request to server 
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type');
	res.setHeader('Access-Control-Allow-Headers', 'X-Signature');
	res.setHeader('Access-Control-Allow-Headers', 'X-Key');
	//res.setheader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Set-Cookie', req.headers.cookie+'; HttpOnly');//set http only

	next();
});

//User
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
Router.post('/keepstate', verifyToken, userCtrl.keepStateLogin);
Router.post('/logout', userCtrl.checkUserLogoutCtrl);
Router.post('/checkUser', userCtrl.checkExistedAc);
Router.post('/authenemail',  userCtrl.authenticateEmail);
Router.post('/sendauthenemail', userCtrl.sendAuthenticateEmail);

export default Router;