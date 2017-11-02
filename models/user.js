const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const User = new Schema({
	username: String,
	password: String,
	profileImg: String,
	myPost: [{ type: ObjectId }],
	likePost: [{ type: ObjectId }],
	saySomething: String
});

module.exports = mongoose.model('User', User);
