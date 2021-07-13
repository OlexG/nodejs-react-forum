interface ISubscription {
	[key: string]: () => void;
}

export default class Publisher {
	subscriptions: ISubscription;
	constructor(subscriptions: ISubscription) {
		this.subscriptions = subscriptions;
	}

	subscribe(id: string, fn: () => void) {
		this.subscriptions[id] = fn;
	}

	unsubscribe(id: string) {
		delete this.subscriptions[id];
	}

	async notify(id: string[]) {
		console.log('In Publisher, attempting to notify', id);
		for (const curId of id) {
			if (this.subscriptions[curId]) {
				console.log('Sending notification to client');
				this.subscriptions[curId]();
			} else {
				console.log(this.subscriptions[curId]);
			}
		}
	}
}
