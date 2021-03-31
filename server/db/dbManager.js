const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class PostManager {
	// class with functions relating to accessing and editing post data
	constructor (collection) {
		this.collection = collection;
	}

	async getPost (postId) {
		return await this.collection.findOne({ _id: ObjectId(postId) });
	};

	async getAllPosts () {
		return await this.collection.find({}).toArray();
	};

	async addPost (title, body) {
		const post = await this.collection.insertOne({
			title,
			body
		});
		return post.insertedId;
	}

	async getNumberOfPosts () {
		return await this.collection.countDocuments();
	}

	async getPostsPage (pageSize, pageNum) {
		pageSize = parseInt(pageSize);
		pageNum = parseInt(pageNum);
		if (pageNum < 0) {
			return [];
		}
		const count = await this.getNumberOfPosts();
		if (pageSize * (pageNum - 1) > count) {
			return [];
		}
		return await this.collection.find().skip(pageSize * (pageNum - 1)).limit(pageSize).toArray();
	}
}

class UserManager {
	// class with functions relating to accessing and editing user data
	constructor (collection) {
		this.collection = collection;
	}

	async addUser (username, password) {
		if (await this.collection.findOne({ username })) {
			return 'username already exists';
		}
		const hashedPassword = await bcrypt.hash(password, 8);
		await this.collection.insertOne({
			username,
			password: hashedPassword
		});
		return 'success';
	}

	async addRefreshToken (username, refreshToken) {
		await this.collection.updateOne({ username }, { $set: { refreshToken } });
	}

	async deleteRefreshToken (refreshToken) {
		await this.collection.updateOne({ refreshToken }, { $unset: { refreshToken: '' } });
	}

	async findRefreshToken (refreshToken) {
		const user = await this.collection.findOne({ refreshToken });
		if (user) {
			return user.username;
		}
		return false;
	}

	async verifyUser (username, password) {
		const user = await this.collection.findOne({ username });
		if (user) {
			return await bcrypt.compare(password, user.password);
		}
		return false;
	}

	async testAddUser () {
		await this.collection.insertOne({
			username: 'test'
		});
	}

	async DELETE_ALL_USERS () {
		await this.collection.remove();
	}
}

module.exports = { PostManager, UserManager };
