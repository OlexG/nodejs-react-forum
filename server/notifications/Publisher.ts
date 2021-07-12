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
		for (const curId of id) {
			if (this.subscriptions[curId]) {
				this.subscriptions[curId]();
			}
		}
	}
}
