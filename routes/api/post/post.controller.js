const Post = require('../../../models/post');
const User = require('../../../models/user');
const AWS = require('aws-sdk');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();
// Post 생성
exports.makePost = (req, res) => {
	const d = new Date();
	d.setUTCHours(d.getUTCHours() + 9);
	const { title, content, base64, tags } = req.body;
	const picKey = d.getFullYear()+'_'
									+d.getMonth()+'_'
									+d.getDate()+'_'
									+d.getTime()+'_'
									+d.getSeconds()+'_'
									+req.decoded._id+'.jpg';
	const picUrl = 'https://s3.amazonaws.com/fashionpobucket/' + picKey;

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
				if (err) return res.status(500).json({ error: err });
				s3.putObject({ 
					Bucket: 'fashionpobucket', 
					Key: picKey,
					Body: buf, 
					ACL: 'public-read' 
				}, function(err) {
					if (err) {
						return res.send({ message: err });
					} else {
						client
							.labelDetection(picUrl)
							.then(results => {
								const labels = results[0].labelAnnotations;
								let labelArray = [];
								labels.forEach(label => labelArray.push(label.description));
								return labelArray;
							})
							.then((array) => {
								post.imageTags = array;
								return post.save();
							})
							.catch(err => {
								console.error('ERROR:', err);
							});
						return res.send({ message: 'upload success' });
					}
				});
			});
		});
	});
};

exports.getAllPosts = (req, res) => {
	Post.find({}).sort( { '_id':-1 } )
		.then(
			posts => {
				res.status(200).json({
					posts
				});
			}
		);
};

exports.getMyPost = (req, res) => {
	User.findOne({ _id: req.decoded._id }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message: 'no such user' });
		Post.find({ _id: { $in: user.myPost } }, (err, post) => {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message: 'no such post' });
			return res.status(200).json({
				posts: post
			});
		});
	});
};
exports.deletePost = (req, res) => {
	const { post_id } = req.params;
	Post.deleteOne({ _id : post_id }, (err) => {
		if (err) return res.status(500).json({ error: err });
		return res.status(200).json({ 
			message: 'post deleted successfully' 
		});
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
			return res.status(200).json({ 
				message: 'post updated successfully' 
			});
		});
	});
};
exports.getMyLikePost = (req, res) => {
	User.findOne({ _id: req.decoded._id }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(404).json({ message:'no such user' });
		Post.find({ _id : { $in : user.likePost } }, (err, post) => {
			if (err) return res.status(500).json({ error: err });
			if (!post) return res.status(404).json({ message:'no such post' });
			return res.status(200).json({
				posts: post
			});
		});
	});
};

exports.likePost = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id })
		.then((post) => {
			post.likeCnt++;
			post.save( (err, newPost) => {
				User.findOne({ _id: req.decoded._id })
					.then((user) => {
						user.likePost.push(newPost);
						user.save((err) => {
							if (err) return res.status(500).json({ error: err });
							return res.status(200).json({
								message: 'post liked successfully'
							});
						});
					});
			});
		})
		.catch((err) => {
			return res.status(500).json({ error: err });
		});
};

exports.deleteLike = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id }, (err, post) => {
		if (err) return res.status(500).json({ error: err });
		if (!post) return res.status(404).json({ message: 'no such post' });
		post.likeCnt--;
		post.save((err) => {
			if (err) return res.status(500).json({ error: err });
			User.findOne({ _id: req.decoded._id }, (err, user) => {
				if (err) return res.status(500).json({ error: err });
				if (!user) return res.status(404).json({ message: 'no such user' });
				let index = user.likePost.indexOf(post_id);
				user.likePost.splice(index, 1);
				user.save((err) => {
					if (err) return res.status(500).json({ error: err });
					return res.status(200).json({ message: 
						'post liked deleted successfully' 
					});
				});
			});
		});
	});
};

exports.getPostById = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id })
		.then((post) => {
			return res.status(200).json({ post: post });
		})
		.catch((err) => {
			return res.status(500).json({ error: err });
		});
};

exports.viewPost = (req, res) => {
	const { post_id } = req.params;
	Post.findOne({ _id: post_id })
		.then((post) => {
			post.viewCnt++;
			post.save((err) => {
				if (err) return res.status(500).json({ error: err });
				return res.status(200).json({ message: 
					'post viewed successfully' 
				});
			});
		})
		.catch((err) => {
			return res.status(500).json({ error: err });
		});
};

exports.commentCreate = (req, res) => {
	const { post_id, comment } = req.body;

	User.findOne({ _id: req.decoded._id })
		.then((user) => {
			return user.username;
		})
		.then((username) => {
			Post.findOne({ _id: post_id })
				.then((post) => {
					let content = {
						comment: comment,
						username: username
					};
					post.comments.push(content);
					return post.save();
				})
				.then((post) => {
					if (!post) return res.status(406).json({ message: 'no such post' });
					return res.status(200).json({ message: 'comment successfully created' });
				})
				.catch((err) => {
					return res.status(500).json({ error: err });
				});
		});
};

exports.commentDelete = (req, res) => {
	// const {  } = req.body;
	const { post_id, comment_id } = req.params;
	Post.findOne({ _id : post_id })
		.then((post) => {
			for (let i=0;i<post.comments.length;i++) {
				if (post.comments[i].writtenBy == req.decoded._id && post.comments[i]._id == comment_id) {
					console.log('yes');
					post.comments.splice(i, 1);
					return post.save();
					// break;
				}
			}
		})
		.then((post) => {
			if (!post) return res.status(406).json({ message: 'no such post' });
			return res.status(200).json({ message: 'comment successfully deleted' });
		})
		.catch((err) => {
			return res.status(500).json({ error: err });
		});
};