const { initManagers } = require('../db/initDB');
const { userManager } = initManagers();

module.exports = async function (req, res, next) {
	const { username, password } = req.body;
	const valid = await userManager.verifyUser(username, password);
	if (valid) {
		next();
	} else {
		res.sendStatus(400);
	}
};
