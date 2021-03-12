const express = require('express');
const { initDB, initManagers} = require('./server/db/init_db.js');
const app = express();
const port = 3000;

initDB().then(() => {
	const { post_manager, user_manager } = initManagers();
	user_manager.test_add_user();

	app.use(express.static('client'));
	app.listen(port, () => console.log('listening on %d', port));
}).catch(error => {
	console.error(error);
});
