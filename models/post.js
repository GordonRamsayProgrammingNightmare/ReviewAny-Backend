const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const Post = new Schema({
	title: String,
	content: String,
	picUrl: String,
	tags: [{ tag: String }],
	writtenBy: { type: ObjectId, ref:'User' },
	writtenAt: Date,
	likeCnt: { type: Number, default: 0 },
	viewCnt: { type: Number, default: 0 },
	comments: [{ 
		comment: String,
		username: { type: String, ref: 'User' },
	}],
	imageTags: [{ type: String }]
});

module.exports = mongoose.model('Post', Post);
