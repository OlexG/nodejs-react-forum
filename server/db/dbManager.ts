import { ObjectId } from 'mongodb';
import * as models from './models';
import mongo = require('mongodb');
import bcrypt = require('bcrypt');

export class PostManager {
	// class with functions relating to accessing and editing post data

	collection: mongo.Collection;

	constructor(collection) {
		this.collection = collection;
	}

	async getPost(postId: string): Promise<models.Post> {
		return this.collection.findOne({ _id: new ObjectId(postId) });
	};

	async getAllPosts(): Promise<models.Post[]> {
		return this.collection.find({}).toArray();
	};

	async addPost(title: string, body: string, username: string) {
		const post = await this.collection.insertOne({
			title,
			body,
			upvotes: 0,
			author: username,
			date: new Date()
		} as models.Post);
		return post.insertedId;
	}

	async getNumberOfPosts(): Promise<number> {
		return this.collection.countDocuments();
	}

	async getPostsPage(pageSize: number | string, pageNum: number | string): Promise<models.Post[]> {
		if (typeof pageSize === 'string') pageSize = parseInt(pageSize);
		if (typeof pageNum === 'string') pageNum = parseInt(pageNum);
		if (pageNum < 0) {
			return [];
		}
		const count = await this.getNumberOfPosts();
		if (pageSize * (pageNum - 1) > count) {
			return [];
		}
		return this.collection.find().skip(pageSize * (pageNum - 1)).limit(pageSize).toArray();
	}

	async upvotePost(postID: string, username: string, userManager: UserManager): Promise<boolean> {
		if (await userManager.removePostDownvote(postID, username)) {
			this.collection.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: 1 } }
			);
		}
		if (await userManager.addPostUpvote(postID, username)) {
			this.collection.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: 1 } }
			);
			return true;
		}
		return false;
	}

	async downvotePost(postID: string, username: string, userManager: UserManager): Promise<boolean> {
		if (await userManager.removePostUpvote(postID, username)) {
			this.collection.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: -1 } }
			);
		}
		if (await userManager.addPostDownvote(postID, username)) {
			this.collection.updateOne(
				{ _id: new ObjectId(postID) },
				{ $inc: { upvotes: -1 } }
			);
			return true;
		}
		return false;
	}

	async DELETE_ALL_POSTS(): Promise<void> {
		this.collection.deleteMany({});
	}
}

export class UserManager {
	// class with functions relating to accessing and editing user data

	collection: mongo.Collection;

	constructor(collection) {
		this.collection = collection;
	}

	async addPostUpvote(postID: string, username: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user && !Object.prototype.hasOwnProperty.call(user.upvotes, postID)) {
			const update = { $addFields: {} };
			// eslint-disable-next-line dot-notation
			update.$addFields['upvotes'] = { [postID]: 1 };
			this.collection.updateOne({ username }, [update]);
			return true;
		}
		return false;
	}

	async addPostDownvote(postID: string, username: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user && !Object.prototype.hasOwnProperty.call(user.downvotes, postID)) {
			const update = { $addFields: {} };
			// eslint-disable-next-line dot-notation
			update.$addFields['downvotes'] = { [postID]: 1 };
			this.collection.updateOne({ username }, [update]);
			return true;
		}
		return false;
	}

	async removePostDownvote(postID: string, username: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user && postID in user.downvotes) {
			const update = { $unset: [] };
			// eslint-disable-next-line dot-notation
			update.$unset.push(`downvotes.${postID}`);
			this.collection.updateOne({ username }, [update]);
			return true;
		}
		return false;
	}

	async removePostUpvote(postID: string, username: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user && postID in user.upvotes) {
			const update = { $unset: [] };
			// eslint-disable-next-line dot-notation
			update.$unset.push(`upvotes.${postID}`);
			this.collection.updateOne({ username }, [update]);
			return true;
		}
		return false;
	}

	async addUser(username: string, password: string): Promise<string> {
		if (await this.collection.findOne({ username })) {
			return 'username already exists';
		}
		const hashedPassword = await bcrypt.hash(password, 8);
		await this.collection.insertOne({
			username,
			password: hashedPassword,
			upvotes: {},
			downvotes: {}
		} as models.User);
		return 'success';
	}

	async addRefreshToken(username: string, refreshToken: string): Promise<void> {
		this.collection.updateOne({ username }, { $set: { refreshToken } });
	}

	async deleteRefreshToken(refreshToken: string): Promise<void> {
		this.collection.updateOne({ refreshToken }, { $unset: { refreshToken: '' } });
	}

	async findRefreshToken(refreshToken: string): Promise<string | null> {
		const user = await this.collection.findOne({ refreshToken });
		if (user) {
			return user.username;
		}
		return null;
	}

	async getUserReactions(username: string): Promise<Object | null> {
		const user = await this.collection.findOne({ username });
		if (user) {
			return { downvotes: user.downvotes, upvotes: user.upvotes };
		}
		return null;
	}

	async verifyUser(username: string, password: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user) {
			return await bcrypt.compare(password, user.password);
		}
		return false;
	}

	async testAddUser(): Promise<void> {
		this.collection.insertOne({
			username: 'test'
		});
	}

	async DELETE_ALL_USERS(): Promise<void> {
		this.collection.deleteMany({});
	}
}
