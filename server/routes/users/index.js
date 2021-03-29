const jwt = require('jsonwebtoken');
const { celebrate } = require('celebrate');
const express = require('express');
const { initManagers } = require('../../db/initDB.js');
const userSchema = require('../../schemas/userSchema.js');
const app = module.exports = express();
const { userManager } = initManagers();

// sign-up user
app.post('/users', celebrate(userSchema), async function (req, res, next) {
	const { username, password } = req.body;
	userManager.addUser(username, password).then((result) => {
		if (result === 'username already exists') {
			res.statusCode = 400;
		}
		res.send({ validation: { body: { message: result } } });
	}).catch((e) => {
		next(e);
	});
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
