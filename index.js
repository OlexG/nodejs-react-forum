const express = require('express');
const { initDB } = require('./server/db/init_db.js');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

initDB().then(() => {
	// eslint-disable-next-line node/global-require
	const routes = require('./server/routes.js');
	app.use(bodyParser.json());
	routes(app);

	app.listen(process.env.PORT, () => console.log('listening on %d', process.env.PORT));
}).catch(error => {
	console.error(error);
});
