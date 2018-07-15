// server.js

// module =================================================
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import database from './config/db';
import router from './app/routes';

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


// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img with be /img for users
app.use(express.static(__dirname + '/public'));

app.use('/api', router);

// start app ==================================
//startup our app at http://localhost:8080
app.listen(port, (err) => {
    if (err) throw Error(err);
    console.log(`Server running port ${port}`);
});

export default app;
