const { v4 } = require('uuid');

class PostManager {
	// class with functions relating to accessing and editing post data
	constructor (collection) {
		this.collection = collection;
	}

	async getPost (postId) {
		return await this.collection.findOne({ postId });
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

	async testAddUser () {
		await this.collection.insertOne({
			usename: 'test'
		});
	}
}

module.exports = { PostManager, UserManager };
