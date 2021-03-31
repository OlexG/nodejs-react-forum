const jwt = require('jsonwebtoken');
const { initManagers } = require('../db/initDB');
const { userManager } = initManagers();

async function postUsers (req, res, next) {
	const { username, password } = req.body;
	userManager.addUser(username, password).then((result) => {
		if (result === 'username already exists') {
			res.statusCode = 400;
		}
		res.send({ validation: { body: { message: result } } });
	}).catch((e) => {
		next(e);
	});
}

async function postToken (req, res, next) {
	const { username, password } = req.body;
	userManager.verifyUser(username, password).then((valid) => {
		if (valid) {
			const accessToken = jwt.sign({ username }, process.env.JWT_SECRET);
			res.cookie('token', accessToken, { overwrite: true });
			res.cookie('username', username, { overwrite: true });
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	}).catch((e) => {
		next(e);
	});
}

module.exports = {
	postUsers,
	postToken
};
