import mongo = require('mongodb');

interface Post {
	_id: mongo.ObjectID;
	title: string;
	body: string;
	upvotes: number;
	author: string;
	date: Date;
}

interface User {
	_id: mongo.ObjectID;
	username: string;
	password: string;
	upvotes: Object;
	downvotes: Object;
}

export { Post };
export { User };
