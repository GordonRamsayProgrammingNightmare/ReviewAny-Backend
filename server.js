/* =======================
 LOAD THE DEPENDENCIES
 ==========================*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

/* =======================
 LOAD THE CONFIG
 ==========================*/
const config = require('./config');
const port = process.env.PORT || 3000;

/* =======================
 EXPRESS CONFIGURATION
 ==========================*/
const server = express();

// parse JSON and url-encoded query
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


// print the request log on console
server.use(morgan('dev'));
// set the secret key variable for jwt
server.set('jwt-secret', config.secret);

server.use('/api', require('./routes/api'));

// open the server
server.listen(port, () => {
	console.log(`Express is running on port ${port}`);
});

/* =======================
 CONNECT TO MONGODB SERVER
 ==========================*/
mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
	console.log('connected to mongodb server');
});
