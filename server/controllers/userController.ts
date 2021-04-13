import { initManagers } from '../db/initDB';
import jwt = require('jsonwebtoken');
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
	res.cookie('refreshToken', refreshToken, { overwrite: true, httpOnly: true, sameSite: 'strict' });
	res.cookie('username', username, { overwrite: true });

	await userManager.addRefreshToken(username, refreshToken);

	res.sendStatus(200);
}

async function getAccessToken (req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const decoded = jwt.decode(refreshToken, { complete: true });
	if (decoded.payload.username !== username) return res.sendStatus(401);
	const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
	res.cookie('accessToken', accessToken, { overwrite: true });
	res.sendStatus(200);
}

async function logout (req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	await userManager.deleteRefreshToken(refreshToken);
	// delete the http ONLY refreshToken
	res.clearCookie('refreshToken');
	res.sendStatus(200);
}

export default {
	postUsers,
	login,
	getAccessToken,
	logout
};
