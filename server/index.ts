/* eslint-disable node/global-require */
import { initDB } from './db/initDB';
import { errors } from 'celebrate';
import { errorHandler } from './errorHandler';
import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import path = require('path');
import swaggerUi = require('swagger-ui-express');
import fs = require('fs');
import cors = require('cors');
const swaggerDocument = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '../swagger.json')).toString('utf-8')
);
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = express();

initDB()
	.then(() => {
		const posts = require('./routes/posts/index');
		const users = require('./routes/users/index');
		// set up cors for all routes
		if (process.env.MODE === 'PRODUCTION') {
			// serve the built app statically
			app.use(express.static(path.join(__dirname, '../client/build')));
		}

		app.use(cookieParser());
		app.use(bodyParser.json());
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

		app.use(
			cors({
				optionsSuccessStatus: 200,
				credentials: true,
				origin: [
					'http://localhost:3000',
					'https://igorleshchenko.github.io/star-university-q3-2021-group-1',
					'https://igorleshchenko.github.io/star-university-q3-2021-group-2',
					'https://igorleshchenko.github.io'
				],
				exposedHeaders: ['accesstoken', 'refreshtoken', 'username']
			})
		);

		app.use(function (req, res, next) {
			res.header('Content-Type', '*/*');
			res.header('Access-Control-Allow-Credentials', 'true');
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
			);
			next();
		});

		app.use(posts);
		app.use(users);
		if (process.env.MODE === 'PRODUCTION') {
			// serve the index.html file for any request, if it is not an api request
			app.get('*', function (req, res) {
				res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
			});
		}
		app.use(errors());
		app.use(errorHandler);
		app.listen(process.env.PORT, () =>
			console.log('listening on %d', process.env.PORT)
		);
	})
	.catch((error) => {
		console.error(error);
	});

export { app };
