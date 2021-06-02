import mongoose = require('mongoose');

interface IPost extends mongoose.Document {
	title: string;
	body: string;
	upvotes: number;
	author: string;
	date: Date;
	parent?: mongoose.Types.ObjectId;
}

const PostSchema = new mongoose.Schema({
	title: {
		type: String
	},
	body: {
		type: String
	},
	upvotes: {
		type: Number
	},
	author: {
		type: String
	},
	date: {
		type: Date
	},
	parent: {
		type: mongoose.Types.ObjectId
	}
}, { minimize: false });

// Index the title of the post and parent of the post for searching
PostSchema.index({ title: 'text', parent: 1 });

interface IUser extends mongoose.Document {
	username: string;
	password: string;
	upvotes: object;
	downvotes: object;
}

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	upvotes: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	downvotes: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	refreshToken: {
		type: String
	}
}, { minimize: false });

export { IPost };
export { PostSchema };
export { IUser };
export { UserSchema };
