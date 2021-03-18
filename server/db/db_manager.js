const { v4 } = require('uuid');

class PostManager {
	// class with functions relating to accessing and editing post data
	constructor (collection) {
		this.collection = collection;
	}

	getPost (postId) {
		return this.collection.findOne({ postId });
	};

	getAllPosts () {
		return this.collection.find({});
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
