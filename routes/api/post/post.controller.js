const Post = require('../../../models/post');
const User = require('../../../models/user');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();
// Post 생성
exports.makePost = (req, res) => {
	const d = new Date();
	d.setUTCHours(d.getUTCHours() + 9);
	const { title, content, base64, tags } = req.body;
	const picUrl = 'https://s3.amazonaws.com/fashionpobucket/'+d.getFullYear()+'_'+d.getMonth()+'_'+d.getDate()+'_'+d.getTime()+'_'+d.getSeconds()+'_'+req.decoded._id+'.jpg';

	User.findOne({ _id : req.decoded._id }, function(err, user) {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		// console.log(base64);
		let post = new Post({
			title,
			content,
			tags,
			picUrl,
			writtenBy: req.decoded._id,
			writtenAt: d
		});
		post.save(function(err, post) {
			if (err) return res.status(500).json({ error:err });
			let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
			user.myPost.push(post._id);
			user.save((err) => {
				s3.putObject({ Bucket: 'fashionpobucket', Key: d.getFullYear()+'_'+d.getMonth()+'_'+d.getDate()+'_'+d.getTime()+'_'+d.getSeconds()+'_'+req.decoded._id+'.jpg', Body: buf, ACL: 'public-read' }, function(err) {
					if (err) {
						return res.send({ message: err });
					} else {
						return res.send({ message: 'upload success' });
					}
				});
			});
		});
	});
};

exports.getAllPosts = (req, res) => {
	Post.find({}).sort( { 'writtenAt':-1 } )
		.then(
			posts => {
				res.status(200).json({
					posts
				});
			}
		);
};
exports.getMyPost = (req, res) => {
	Post.find({ writtenBy : req.decoded._id })
		.then(
			posts => {
				res.json({ posts });
			}
		);
};
exports.deletePost = (req, res) => {
	const { post_id } = req.params;
	Post.deleteOne({ _id : post_id }, (err) => {
		if (err) return res.status(500).json({ error: err });
		return res.status(200).json({ message: 'post deleted successfully' });
	});
};

exports.updatePost = (req, res) => {
	const { post_id } = req.params;
	const { title, content } = req.body;
	Post.findOne({ _id : post_id }, (err, post) => {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message:'no such post' });

		post.title = title;
		post.content = content;

		post.save((err) => {
			if (err) return res.status(500).json({ error: err });
			return res.status(200).json({ message: 'post updated successfully' });
		});
	});
};
exports.getMyLikePost = (req, res) => {
	let postArray = [];
	User.findOne({ _id: req.decoded._id }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		// for(let i=0; i<user.likePost.length; i++) {
		Post.find({ _id : { $in : user.likePost } }, (err, post) => {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message:'no such post' });
			return res.status(200).json({
				posts: post
			});
		});
		// }
	});
};

exports.likePost = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id }, (err, post) => {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message:'no such post' });
		post.likeCnt++;
		post.save( (err, newPost) => {
			if (err) return res.status(500).json({ error: err });
			User.findOne({ _id : req.decoded._id }, (err, user) => {
				if (err) return res.status(500).json({ error: err });
				if (!user) return res.status(404).json({ message:'no such user' });
				user.likePost.push(newPost);
				user.save( (err) => {
					if (err) return res.status(500).json({ error: err });
					return res.status(200).json({ message: 'post liked successfully' });
				});
			});
		});
	});
};

exports.viewPost = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id }, (err, post) => {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message:'no such post' });
		post.viewCnt++;
		post.save((err, newPost) => {
			if (err) return res.status(500).json({ error: err });
			return res.status(200).json({ message: 'post viewed successfully' });
		});
	});
};
