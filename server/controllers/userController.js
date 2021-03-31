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

async function postTokens (req, res, next) {
	const { username, password } = req.body;
	const valid = await userManager.verifyUser(username, password);
	if (valid) {
		const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
		const refreshToken = jwt.sign({ username }, process.env.REFRESH_JWT_SECRET);

		res.cookie('accessToken', accessToken, { overwrite: true });
		res.cookie('refreshToken', refreshToken, { overwrite: true });
		res.cookie('username', username, { overwrite: true });

		await userManager.addRefreshToken(username, refreshToken);

		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}

async function postAccessToken (req, res, next) {
	const refreshToken = req.headers.authorization.split(' ')[1];
	const username = await userManager.findRefreshToken(refreshToken);
	const decoded = jwt.decode(refreshToken);
	if (decoded.username === username) {
		const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
		res.cookie('accessToken', accessToken, { overwrite: true });
		res.sendStatus(200);
		return;
	}
	res.sendStatus(401);
}

async function deleteTokens (req, res, next) {
	const refreshToken = req.headers.authorization.split(' ')[1];
	await userManager.deleteRefreshToken(refreshToken);
	res.sendStatus(200);
}

module.exports = {
	postUsers,
	postTokens,
	postAccessToken,
	deleteTokens
};
