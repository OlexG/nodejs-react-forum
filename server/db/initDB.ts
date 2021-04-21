import { PostManager, UserManager } from './dbManager';
import mongoose = require('mongoose');
require('dotenv').config();

export async function initDB() {
	try {
		await mongoose.connect(process.env.URI);
	} catch (e) {
		console.log('Cannot connect to database');
		throw e;
	}
};

export function initManagers() {
	const postManager = new PostManager();
	const userManager = new UserManager();
	return { postManager, userManager };
}
