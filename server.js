// server.js

// module =================================================
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import database from './config/db';
import router from './app/router/routes';
import router1 from './app/router/router1';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express();

// set our port
const port = process.env.PORT || 3000;

// connect to our mongoDB database

mongoose.connect(database.url, { useMongoClient: true }, (err) => {
  if (err) {
    console.log('Connect Error!');
  }
  console.log('Connect success!');
});

//using session
const session = require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 48*3600*1000 }
});//if secure:true session can not intinital ???

// Use express-session middleware for express
app.use(session);

// parse application/json
app.use(bodyParser.json());

//using cookies
app.use(cookieParser())

// show requests, responses from clients and server to comand line
   app.use(morgan('dev'))

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img with be /img for users
app.use(express.static(__dirname + '/public'));

app.use('/user', router);
app.use('/api', router1);

app.use(csurf({ cookie: true }))
//create XSRF token 
app.use(function (req, res, next) {
  req.session._csrf =  req.csrfToken();
  res.cookie('XSRF_TOKEN', req.session._csrf);
  next();
});

// start app ==================================
//startup our app at http://localhost:8080
app.listen(port, (err) => {
    if (err) throw Error(err);
    console.log(`Server running port ${port}`);
});

export default app;
