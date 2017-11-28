const User = require('../../../models/user');
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
	User.findOne({ _id: user_id }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message: 'no such user' });
		return res.status(200).json({ username : user.username });
	});
};