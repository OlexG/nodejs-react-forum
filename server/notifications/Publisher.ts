import { initManagers } from '../db/initDB';
console.log(initManagers);
const { postManager } = initManagers();

interface ISubscription {
	[key: string]: () => void;
}

export default class Publisher {
	subscriptions: ISubscription;
	constructor(subscriptions: ISubscription) {
		this.subscriptions = subscriptions;
	}

	subscribe(postId: string, fn: () => void) {
		this.subscriptions[postId] = fn;
	}

	unsubscribe(postId: string) {
		delete this.subscriptions[postId];
	}

	async notify(postId) {
		let curId = postId;
		while (curId) {
			if (this.subscriptions[curId]) {
				this.subscriptions[curId]();
			}
			const parentId = (await postManager.getPost(curId)).parent;
			if (parentId) {
				curId = (await postManager.getPost(parentId.toString()))._id;
			} else {
				break;
			}
		}
	}
}
