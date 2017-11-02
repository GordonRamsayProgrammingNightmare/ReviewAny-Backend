const Post = require('../../../models/post');
const User = require('../../../models/user');

// Post 생성
exports.makePost = (req, res) => {
	const { title, content, rate, picUrl, tags } = req.body;
	User.findOne({ _id : req.decoded._id }, function(err, user) {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		let post = new Post({
			title,
			content,
			rate,
			picUrl,
			tags,
			writtenBy: req.decoded._id
		});
		post.save(function(err) {
			if (err) return res.status(500).json({ error:err });
			return res.status(200).json({ message: 'post successfully saved' });
		});
	});
};

exports.getPost = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id : post_id }, function(err, post) {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message:'no such post' });
		return res.status(200).json({
			post: post
		});
	});
};

exports.getAllPosts = (req, res) => {
	Post.find({}).sort( { 'writtenAt':-1 } )
		.then(
			posts => {
				res.status(200).json({
					posts
				})
			}
		)
};

exports.deletePost = (req, res) => {
	const { post_id } = req.params;
	Post.deleteOne({ _id : post_id }, function(err) {
		if (err) return res.status(500).json({ error: err });
		return res.status(200).json({ message: 'post deleted successfully' });
	});
};

exports.updatePost = (req, res) => {
	const { post_id } = req.params;
	const { title, content } = req.body;
	Post.findOne({ _id : post_id }, function(err, post) {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message:'no such post' });

		post.title = title;
		post.content = content;

		post.save(function(err) {
			if (err) return res.status(500).json({ error: err });
			return res.status(200).json({ message: 'post updated successfully' });
		});
	});
};
