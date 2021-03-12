const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const { PostManager, UserManager} = require('./db_manager.js');
const uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const port = 8080;
const client = new MongoClient(uri);

(async () => {
	try {
		await client.connect();
	} catch (e) {
		await client.close();
		throw e;
	}
	const post_collection = client.db('Forum_DB').collection('posts');
	const user_collection = client.db('Forum_DB').collection('users');
	const post_manager = new PostManager(post_collection);
	const user_manager = new UserManager(user_collection);
	user_manager.test_add_user();

	app.use(express.static('public'));
	app.listen(port, () => console.log('listening on %d', port));
})().catch((reason) => {
	throw reason;
});
