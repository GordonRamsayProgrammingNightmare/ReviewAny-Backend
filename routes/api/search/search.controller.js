const Post = require('../../../models/post');
const User = require('../../../models/user');

exports.searchByTag = (req, res) => {
	const { tag } = req.params;
	if (tag === undefined) {
		return res.status(406).json({ message : 'parameter wrong' });
	} else {
		Post.find({ 'tags': { $elemMatch: { 'tag': tag } } }, function(err, post) {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message: 'no such post' });
			return res.status(200).json({
				post: post
			})
		});
	}
}

exports.searchByTitle = (req, res) => {
	const { title } = req.params;
	if (title === undefined) {
		return res.status(406).json({ message : 'parameter wrong' });
	} else {
		Post.find({ 'title' : { $regex : '.*'+title+'.*' } }, function(err, post) {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message: 'no such post' });
			return res.status(200).json({
				post: post
			})
		});
	}
}

exports.searchByContent = (req, res) => {
	const { content } = req.params;
	if (content === undefined) {
		return res.status(406).json({ message : 'parameter wrong' });
	} else {
		Post.find({ 'content' : { $regex : '.*'+content+'.*' } }, function(err, post) {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message: 'no such post' });
			return res.status(200).json({
				post: post
			})
		});
	}
}