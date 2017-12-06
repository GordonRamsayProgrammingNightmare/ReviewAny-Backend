/* =======================
 LOAD THE DEPENDENCIES
 ==========================*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
// const vision = require('@google-cloud/vision');
// const client = new vision.ImageAnnotatorClient();
/* =======================
 LOAD THE CONFIG
 ==========================*/
const config = require('./config');
const port = process.env.PORT || 3000;

/* =======================
 EXPRESS CONFIGURATION
 ==========================*/
const server = express();
process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});
server.use(cors());
server.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// parse JSON and url-encoded query
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({ extended:true,limit:'50mb' }));
// client
// 	.imageProperties('https://s3.amazonaws.com/fashionpobucket/2017_11_1_1512129681743_21_5a203c9f71e183bc1c86b083.jpg')
// 	.then(results => {
// 		const labels = results[0].imagePropertiesAnnotation;
// 		const colors = labels.dominantColors.colors;
// 		console.log('Labels:');
// 		colors.forEach(colors => console.log(colors));
// 	})
// 	.catch(err => {
// 		console.error('ERROR:', err);
// 	});

// print the request log on console
server.use(morgan(':remote-addr'), function(req, res, next) {
	next();
});

server.use(morgan(':method'), function(req, res, next) {
	next();
});

server.use(morgan(':url'), function(req, res, next) {
	next();
});

server.use(morgan(':date'), function(req, res, next) {
	next();
});

server.use(morgan(':status'), function(req, res, next) {
	next();
});
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
