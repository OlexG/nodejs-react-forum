import User from './User';
import Publisher from './Publisher';
import { initManagers } from '../db/initDB';
const { postManager } = initManagers();
const users = {};
export const publisher = new Publisher({});

export async function registerUser(
	username,
	notifyFn: (message: string) => void
) {
	if (!users[username]) {
		users[username] = new User(notifyFn);
		const postIds = await postManager.getUserPosts(username);
		// save the user on the users object and subscribe them to all the posts they made
		postIds.forEach((el) => subscribeUser(username, el._id));
	}
}

export function subscribeUser(username, postId) {
	if (users[username]) {
		// subscribe the user with a function that will send the user the postID
		const fn = () => users[username].notify(`data: ${postId}\n\n`);
		publisher.subscribe(postId, fn);
	}
}

export async function unregisterUser(username) {
	if (users[username]) {
		const postIds = await postManager.getUserPosts(username);
		// delete the user from the users object and unsubscribe them from all the posts they made
		postIds.forEach((el) => publisher.unsubscribe(el._id));
		delete users[username];
		console.log(publisher.subscriptions, users);
	}
}
