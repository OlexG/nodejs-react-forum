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

	async notify(postIds: string[]) {
		for (const curId of postIds) {
			if (this.subscriptions[curId]) {
				this.subscriptions[curId]();
			}
		}
	}
}
