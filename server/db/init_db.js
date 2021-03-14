const { PostManager, UserManager } = require('./db_manager');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const client = new MongoClient(uri);

async function initDB () {
	try {
		await client.connect();
	} catch (e) {
		await client.close();
		throw e;
	}
};

function initManagers () {
	const postCollection = client.db('Forum_DB').collection('posts');
	const userCollection = client.db('Forum_DB').collection('users');
	const postManager = new PostManager(postCollection);
	const userManager = new UserManager(userCollection);
	return { postManager, userManager };
}

module.exports = { initDB, initManagers };
