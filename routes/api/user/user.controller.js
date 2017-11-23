const User = require('../../../models/user');

exports.getUserById = (req, res) => {
	// const { user_id } = req.params;
	User.findOne({_id : req.decoded._id}, function(err, user){
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		return res.status(200).json({
			username: user.username,
			profileImg: user.profileImg,
			myPost: user.myPost,
			likePost: user.likePost,
			saySomething: user.saySomething
		})
	})
}
