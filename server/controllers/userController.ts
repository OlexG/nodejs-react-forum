/* eslint-disable @typescript-eslint/no-unused-vars */
import { initManagers } from '../db/initDB';
import { registerUser, publisher, unsubscribeUser } from '../notifications';
import jwt = require('jsonwebtoken');
const { userManager, postManager } = initManagers();
const { resolve } = require('path');

async function postUsers(req, res, next) {
	const { username, password } = req.body;
	const result = await userManager.addUser(username, password);
	if (result === 'username already exists') {
		res.statusCode = 400;
	}
	res.send({ validation: { body: { message: result } } });
}

async function login(req, res, next) {
	const { username } = req.body;
	const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXPIRATION_TIME
	});
	const refreshToken = jwt.sign({ username }, process.env.REFRESH_JWT_SECRET);

	res.cookie('accessToken', accessToken, { overwrite: true });
	res.cookie('refreshToken', refreshToken, {
		overwrite: true,
		httpOnly: true,
		sameSite: 'strict'
	});
	res.cookie('username', username, { overwrite: true });

	await userManager.addRefreshToken(username, refreshToken);

	res.sendStatus(200);
}

async function getAccessToken(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	const username = await userManager.findRefreshToken(refreshToken);
	const decoded = jwt.decode(refreshToken, { complete: true });
	if (decoded.payload.username !== username) return res.sendStatus(401);
	const accessToken = jwt.sign({ username }, process.env.ACCESS_JWT_SECRET, {
		expiresIn: process.env.TOKEN_EXPIRATION_TIME
	});
	res.cookie('accessToken', accessToken, { overwrite: true });
	res.sendStatus(200);
}

async function logout(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	await userManager.deleteRefreshToken(refreshToken);
	// delete the http ONLY refreshToken
	res.clearCookie('refreshToken');
	res.sendStatus(200);
}

async function getUserReactions(req, res, next) {
	const username = req.params.username;
	const reactions = await userManager.getUserReactions(username);
	if (reactions) return res.send(reactions);
	res.sendStatus(400);
}

async function getUserData(req, res, next) {
	const username = req.params.username;
	const data = await userManager.getUserData(username);
	res.send(data);
}

async function changeUserIcon(req, res, next) {
	const username = req.cookies.username;
	if (req.file) {
		await userManager.updateIconPath(username, req.file.path);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}

async function getUserIcon(req, res, next) {
	const path = await userManager.getIconPath(req.params.username);
	if (path === null) {
		res.sendFile(resolve(__dirname, '../../defaultFiles/default.png'));
	} else {
		res.sendFile(path);
	}
}

async function setUpNotifications(req, res, next) {
	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	});
	await registerUser(req.cookies.username, res.write.bind(res), postManager);
	req.on('close', () => {
		unsubscribeUser(req.cookies.username, postManager);
		res.end();
	});
}

export default {
	postUsers,
	login,
	getAccessToken,
	getUserReactions,
	logout,
	getUserData,
	changeUserIcon,
	getUserIcon,
	setUpNotifications
};
