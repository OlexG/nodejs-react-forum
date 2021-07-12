export default class User {
	notify: (message: string) => void;
	constructor(notify) {
		this.notify = notify;
	}
}
