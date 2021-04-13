import { ObjectId } from 'mongodb';
import * as models from './models';
import mongo = require('mongodb');
import bcrypt = require('bcrypt');

export class PostManager {
	// class with functions relating to accessing and editing post data

	collection: mongo.Collection;

	constructor (collection) {
		this.collection = collection;
	}

	async getPost (postId: string): Promise<models.Post> {
		return this.collection.findOne({ _id: new ObjectId(postId) });
	};

	async getAllPosts (): Promise<models.Post[]> {
		return this.collection.find({}).toArray();
	};

	async addPost (title: string, body: string) {
		const post = await this.collection.insertOne({
			title,
			body
		} as models.Post);
		return post.insertedId;
	}

	async getNumberOfPosts (): Promise<number> {
		return this.collection.countDocuments();
	}

	async getPostsPage (pageSize: number | string, pageNum: number | string): Promise<models.Post[]> {
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
}

export class UserManager {
	// class with functions relating to accessing and editing user data

	collection: mongo.Collection;

	constructor (collection) {
		this.collection = collection;
	}

	async addUser (username: string, password: string): Promise<string> {
		if (await this.collection.findOne({ username })) {
			return 'username already exists';
		}
		const hashedPassword = await bcrypt.hash(password, 8);
		await this.collection.insertOne({
			username,
			password: hashedPassword
		} as models.User);
		return 'success';
	}

	async addRefreshToken (username: string, refreshToken: string): Promise<void> {
		this.collection.updateOne({ username }, { $set: { refreshToken } });
	}

	async deleteRefreshToken (refreshToken: string): Promise<void> {
		this.collection.updateOne({ refreshToken }, { $unset: { refreshToken: '' } });
	}

	async findRefreshToken (refreshToken: string): Promise<string | null> {
		const user = await this.collection.findOne({ refreshToken });
		if (user) {
			return user.username;
		}
		return null;
	}

	async verifyUser (username: string, password: string): Promise<boolean> {
		const user = await this.collection.findOne({ username });
		if (user) {
			return await bcrypt.compare(password, user.password);
		}
		return false;
	}

	async testAddUser (): Promise<void> {
		this.collection.insertOne({
			username: 'test'
		});
	}

	async DELETE_ALL_USERS (): Promise<void> {
		this.collection.remove({});
	}
}
