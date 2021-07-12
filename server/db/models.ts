import mongoose = require('mongoose');

interface IPost extends mongoose.Document {
	title: string;
	body: string;
	upvotes: number;
	author: string;
	date: Date;
	parent?: mongoose.Types.ObjectId;
}

const PostSchema = new mongoose.Schema(
	{
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
	},
	{ minimize: false }
);

// Index the title of the post and parent of the post for searching
PostSchema.index({ title: 'text', parent: 1, author: 1 });

interface IUser extends mongoose.Document {
	username: string;
	password: string;
	upvotes: object;
	downvotes: object;
	refreshToken: string;
	reputation: number;
	numberOfPosts: number;
	iconPath: string;
}

const UserSchema = new mongoose.Schema(
	{
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
		},
		reputation: {
			type: Number
		},
		numberOfPosts: {
			type: Number
		},
		iconPath: {
			type: String
		}
	},
	{ minimize: false }
);

// Index the title of the post and parent of the post for searching
UserSchema.index({ username: 1 });

interface IJob extends mongoose.Document {
	value: String;
	data: Partial<IPost>;
}

const JobSchema = new mongoose.Schema({
	value: {
		type: String,
		required: true
	},
	data: {
		type: Object
	}
});

export { IPost };
export { PostSchema };
export { IUser };
export { UserSchema };
export { IJob };
export { JobSchema };
