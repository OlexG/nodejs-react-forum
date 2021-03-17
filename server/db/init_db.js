const { PostManager, UserManager } = require('./db_manager');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.URI);

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
