const mongo = require('mongodb');

class PostManager {
	// class with functions relating to accessing and editing post data
	constructor (collection) {
		this.collection = collection;
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
