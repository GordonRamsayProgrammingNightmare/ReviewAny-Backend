const User = require('../../../models/user');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();
// const Post = require('../../../models/post');

exports.getUserById = (req, res) => {
	// const { user_id } = req.params;
	User.findOne({ _id : req.decoded._id }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		return res.status(200).json({
			username: user.username,
			profileImg: user.profileImg,
			myPost: user.myPost,
			likePost: user.likePost,
			saySomething: user.saySomething
		});
	});
};

exports.getUsernameById = (req, res) => {
	const { user_id } = req.params;
	if (user_id === undefined) {
		return res.status(406).json({ message: 'parameter wrong' });
	} else {
		User.findOne({ _id: user_id }, (err, user) => {
			if (err) return res.status(500).json({ error: err });
			if (!user) return res.status(404).json({ message: 'no such user' });
			return res.status(200).json({ username : user.username });
		});
	}
};

exports.updateUserInfo = (req, res) => {
	const d = new Date();
	d.setUTCHours(d.getUTCHours() + 9);
	const { username, base64, saySomething } = req.body;
	// if (username === undefined || base64 === undefined || saySomething === undefined) {
	// 	return res.status(406).json({ message: 'parameter wrong' });
	// } else {

	const picUrl = 'https://s3.amazonaws.com/fashionpobucket/'
			+ d.getFullYear() + '_'
			+ d.getMonth() + '_'
			+ d.getDate() + '_'
			+ d.getTime() + '_'
			+ d.getSeconds() + '_'
			+ req.decoded._id + '_profile.jpg';
	if (base64 === undefined) {
		User.findOne({ _id: req.decoded._id })
			.then((user) => {
				user.username = username;
				// user.profileImg = picUrl;
				user.saySomething = saySomething;
				return user.save();
			})
			.then((err) => {
				if (err) {
					return res.send({ message: err });
				} else {
					return res.send({ message: 'success' });
				}
			});
	}	else {
		User.findOne({ _id: req.decoded._id })
			.then((user) => {
				user.username = username;
				user.profileImg = picUrl;
				user.saySomething = saySomething;
				user.save();
			})
			.then(() => {
				let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
				s3.putObject({
					Bucket: 'fashionpobucket',
					Key: d.getFullYear() + '_'
						+ d.getMonth() + '_'
						+ d.getDate() + '_'
						+ d.getTime() + '_'
						+ d.getSeconds() + '_'
						+ req.decoded._id + '_profile.jpg',
					Body: buf,
					ACL: 'public-read'
				}, (err) => {
					if (err) {
						return res.send({ message: err });
					} else {
						return res.send({ message: 'upload success' });
					}
				});
			});
	}
	
	// }
};