const { PostManager, UserManager} = require('./db_manager');
const uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const { MongoClient } = require('mongodb');
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
	const post_collection = client.db('Forum_DB').collection('posts');
	const user_collection = client.db('Forum_DB').collection('users');
	const post_manager = new PostManager(post_collection);
	const user_manager = new UserManager(user_collection);
	return { post_manager, user_manager };
}

module.exports = { initDB, initManagers };
