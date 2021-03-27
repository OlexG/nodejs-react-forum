const { initManagers } = require('../../db/initDB.js');
const validateUser = require('../../validation/validateUser.js');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = module.exports = express();
const { userManager } = initManagers();

// sign-up user
app.post('/users', async function (req, res, next) {
	const validationResult = validateUser(req);
	if (validationResult === 'valid') {
		const { username, password } = req.body;
		userManager.addUser(username, password).then((result) => {
			res.send({ result });
		}).catch((e) => {
			next(e);
		});
	} else {
		res.statusCode = 400;
		res.send({ result: validationResult });
	}
});

// log-in the user and return their JWT
app.post('/token', async function (req, res, next) {
	const { username, password } = req.body;
	userManager.verifyUser(username, password).then((valid) => {
		if (valid) {
			const accessToken = jwt.sign({ username }, process.env.JWT_TOKEN);
			res.cookie('token', accessToken, { overwrite: true });
			res.cookie('username', username, { overwrite: true });
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	}).catch((e) => {
		next(e);
	});
});
