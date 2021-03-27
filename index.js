/* eslint-disable node/global-require */
const express = require('express');
const { initDB } = require('./server/db/initDB.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./server/errorHandler.js');
require('dotenv').config();
const app = express();

initDB().then(() => {
	const posts = require('./server/routes/posts/index.js');
	const users = require('./server/routes/users/index.js');
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(posts);
	app.use(users);
	app.use(errorHandler);
	app.listen(process.env.PORT, () => console.log('listening on %d', process.env.PORT));
}).catch(error => {
	console.error(error);
});
