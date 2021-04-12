import mongo = require('mongodb');

interface Post {
	_id: mongo.ObjectID;
	title: string;
	body: string;
}

interface User {
	_id: mongo.ObjectID;
	username: string;
	password: string;
}

export {Post};
export {User};
