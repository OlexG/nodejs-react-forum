export default class User {
	notify: (message: string) => void;
	constructor(notify) {
		this.notify = notify;
	}

	setNotifyFn(fn) {
		this.notify = fn;
	}
}
