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


	var Cookie = req.headers.cookie.split("; "),
        _csrf_token, i = 0, client_csrf
    for(; i < Cookie.length; i++){
        if(Cookie[i].search(/^XSRF_TOKEN=/) != -1){
            _csrf_token = Cookie[i].split('XSRF_TOKEN=')[1];
            break;
        }
    }
 
    if(req.method == "GET"){//not check with get
		client_csrf = _csrf_token
    }else
    	client_csrf = req.body._csrftoken

    if( _csrf_token !== undefined && _csrf_token == client_csrf)
		next()
	else{
	    return res.status(404).send({
		   success: false, 
		   message: constants.error.L1007 
		});
    }
});

//User
Router.post('/createUser', userCtrl.createUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
Router.post('/keepstate', verifyToken, userCtrl.keepStateLogin);
Router.get('/getinfor', verifyToken, userCtrl.getUserInfo)
Router.post('/getinfor', verifyToken, userCtrl.getUserInfo)
Router.post('/logout', userCtrl.checkUserLogoutCtrl);
Router.post('/checkUser', userCtrl.checkExistedAc);
Router.post('/authenemail',  userCtrl.authenticateEmail);
Router.post('/sendauthenemail', userCtrl.sendAuthenticateEmail);

export default Router;