import express from 'express';
import * as userCtrl from '../controllers/userCtrl';
import verifyToken from '../../config/verifyToken';
import constants from '../../config/constants';
import passport from 'passport'
import Facebook from 'passport-facebook'
import Google from 'passport-google-oauth20'

var FacebookStrategy = Facebook.Strategy,
    GoogleStrategy = Google.Strategy

const Router = express.Router();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// page https://console.developers.google.com/apis/credentials?project=phamlinhcute-185422
passport.use(new GoogleStrategy({
    clientID: '172823239135-mp40vrhdbi5tblo33rd0vtn0k4dkpube.apps.googleusercontent.com',
    clientSecret: 'Z4UPARdW1Dyy4LwjXVbJn2gt',
    callbackURL: "http://localhost:8080/user/auth/google/callback"
 //   callbackURL: "https://app-chat-phamlinh.herokuapp.com/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile) {
        var user = profile;
        return done(null, user);
    }else {
        return done(null, false);
    }   
  }
));


//using facebook to login
//webpage https://developers.facebook.com/apps/1956919321249751/fb-login/
passport.use(new FacebookStrategy({
    clientID: '1956919321249751',
    clientSecret: '384d97d8428140eb09a00c3bbce41f43',
    callbackURL: "/user/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   if (profile) {
        user = profile;
        return done(null, user);//se tra ve thong tin nguoi dung o router
    }else {
        return done(null, false);
    }   
  }
));


//all 
Router.use(function (req, res, next) {
	//res.setHeader('Access-Control-Allow-Origin', '*');//allow all of client response when request to server 
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type');
	res.setHeader('Access-Control-Allow-Headers', 'X-Signature');
	res.setHeader('Access-Control-Allow-Headers', 'X-Key');
	//res.setheader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//res.setHeader('Set-Cookie', req.headers.cookie+'; HttpOnly');//set http only


	var Cookie = req.headers.cookie.split("; "),
        _csrf_token, i = 0, client_csrf
     //way 1: reading cookie in req.headers
    // for(; i < Cookie.length; i++){
    //     if(Cookie[i].search(/^XSRF_TOKEN=/) != -1){
    //         _csrf_token = Cookie[i].split('XSRF_TOKEN=')[1];
    //         break;
    //     }
    // }

    //way 2: reading cookie in req.cookies
    _csrf_token = req.cookies.XSRF_TOKEN
 	console.log(_csrf_token + "   " + client_csrf)
    if(req.method == "GET"){//not check with get
		client_csrf = _csrf_token
    }else
    	client_csrf = req.body._csrftoken

    if(_csrf_token === client_csrf)
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
Router.post('updateUser', userCtrl.updateUserCtrl);
Router.post('/login', userCtrl.checkUserLoginCtrl);
//Router.post('/loginAPI', userCtrl.LoginAPI);
Router.post('/keepstate', verifyToken, userCtrl.keepStateLogin);
Router.get('/getinfor', verifyToken, userCtrl.getUserInfo)
Router.post('/getinfor', verifyToken, userCtrl.getUserInfo)
Router.post('/logout', userCtrl.checkUserLogoutCtrl);
Router.post('/checkUser', userCtrl.checkExistedAc);
Router.post('/authenemail',  userCtrl.authenticateEmail);
Router.post('/sendauthenemail', userCtrl.sendAuthenticateEmail);

Router.route('/auth/facebook').get(passport.authenticate('facebook',  { scope : 'email' }))

Router.route('/auth/facebook/callback').get(
	passport.authenticate('facebook', { failureRedirect: '/signup' }), userCtrl.loginWithFacebook)

Router.route('/auth/google').get(passport.authenticate('google',{ scope: [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
  ] }));

Router.route('/auth/google/callback').get( 
    passport.authenticate('google', { failureRedirect: '/signup' }), userCtrl.loginWithGoogle)


export default Router;