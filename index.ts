/* eslint-disable node/global-require */
import { initDB } from './server/db/initDB';
import { errors } from 'celebrate';
import { errorHandler } from './server/errorHandler';
import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

initDB().then(() => {
	const posts = require('./server/routes/posts/index');
	const users = require('./server/routes/users/index');
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(posts);
	app.use(users);
	app.use(errors());
	app.use(errorHandler);
	app.listen(process.env.PORT, () => console.log('listening on %d', process.env.PORT));
}).catch(error => {
	console.error(error);
});

export { app };
