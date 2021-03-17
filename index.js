const express = require('express');
const { initDB, initManagers } = require('./server/db/init_db.js');
const routes = require('./server/routes.js');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

initDB().then(() => {
	const { postManager, userManager } = initManagers();
	userManager.testAddUser();

	app.use(bodyParser.json());
	routes(app, postManager, userManager);

	app.listen(process.env.PORT, () => console.log('listening on %d', process.env.PORT));
}).catch(error => {
	console.error(error);
});
