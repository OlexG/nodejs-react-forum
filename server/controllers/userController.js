const jwt = require('jsonwebtoken');
const { initManagers } = require('../db/initDB');
const { userManager } = initManagers();

async function postUsers (req, res, next) {
	const { username, password } = req.body;
	const result = await userManager.addUser(username, password);
	if (result === 'username already exists') {
		res.statusCode = 400;
	}
	res.send({ validation: { body: { message: result } } });
}

async function login (req, res, next) {
	const { username } = req.body;
	const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
	const refreshToken = jwt.sign({ username }, process.env.REFRESH_JWT_SECRET);

	res.cookie('accessToken', accessToken, { overwrite: true });
	res.cookie('refreshToken', refreshToken, { overwrite: true });
	res.cookie('username', username, { overwrite: true });

	await userManager.addRefreshToken(username, refreshToken);

	res.sendStatus(200);
}

async function postAccessToken (req, res, next) {
	const refreshToken = req.headers.authorization.split(' ')[1];
	const username = await userManager.findRefreshToken(refreshToken);
	const decoded = jwt.decode(refreshToken);
	if (decoded.username !== username) res.sendStatus(401);
	const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
	res.cookie('accessToken', accessToken, { overwrite: true });
	res.sendStatus(200);
}

async function logout (req, res, next) {
	const refreshToken = req.headers.authorization.split(' ')[1];
	await userManager.deleteRefreshToken(refreshToken);
	// delete the http ONLY refreshToken
	res.cookie('refreshToken', '', { overwrite: true, maxAge: 0 });
	res.sendStatus(200);
}

module.exports = {
	postUsers,
	login,
	postAccessToken,
	logout
};
