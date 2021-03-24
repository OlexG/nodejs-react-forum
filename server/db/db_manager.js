const { ObjectId } = require('mongodb');

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
		await this.collection.insertOne({
			username,
			password
		});
		return 'success';
	}

	async verifyUser (username, password) {
		const user = await this.collection.findOne({ username, password });
		if (user) {
			return true;
		}
		return false;
	}

	async testAddUser () {
		await this.collection.insertOne({
			username: 'test'
		});
	}
}

module.exports = { PostManager, UserManager };
