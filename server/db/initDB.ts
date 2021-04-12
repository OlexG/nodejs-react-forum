import { PostManager, UserManager } from './dbManager';
import { MongoClient } from 'mongodb';
require('dotenv').config();
const client = new MongoClient(process.env.URI);

export async function initDB () {
	try {
		await client.connect();
	} catch (e) {
		await client.close();
		throw e;
	}
};

export function initManagers () {
	const postCollection = client.db('Forum_DB').collection('posts');
	const userCollection = client.db('Forum_DB').collection('users');
	const postManager = new PostManager(postCollection);
	const userManager = new UserManager(userCollection);
	return { postManager, userManager };
}
