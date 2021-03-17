const { initManagers } = require('./db/init_db.js');
// eslint-disable-next-line no-unused-vars
const { postManager, userManager } = initManagers();
module.exports = function (app) {
	app.post('/posts', function (req, res) {
		console.log(req.body);
		res.sendStatus(200);
	});
};
